import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_ISSUES } from '../src/data/defaultIssues.ts';
import type { Issue } from '../src/types/issue.ts';

interface AppDatabase {
  communityIssues: Issue[];
  helpfulOverrides: Record<string, number>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'app-db.json');

function ensureDbDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDb(): AppDatabase {
  ensureDbDir();
  if (!fs.existsSync(DB_FILE)) {
    const initial: AppDatabase = {
      communityIssues: [],
      helpfulOverrides: {},
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AppDatabase>;
    return {
      communityIssues: Array.isArray(parsed.communityIssues) ? parsed.communityIssues : [],
      helpfulOverrides:
        parsed.helpfulOverrides && typeof parsed.helpfulOverrides === 'object'
          ? parsed.helpfulOverrides
          : {},
    };
  } catch {
    return {
      communityIssues: [],
      helpfulOverrides: {},
    };
  }
}

function writeDb(db: AppDatabase) {
  ensureDbDir();
  const tempPath = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(tempPath, DB_FILE);
}

export function getAllIssuesMerged(): Issue[] {
  const db = readDb();
  const community = db.communityIssues.map((item) => ({
    ...item,
    helpfulCount: db.helpfulOverrides[item.id] ?? item.helpfulCount,
  }));

  const communityIds = new Set(community.map((c) => c.id));
  const defaults = DEFAULT_ISSUES.filter((d) => !communityIds.has(d.id)).map((d) => ({
    ...d,
    helpfulCount: db.helpfulOverrides[d.id] ?? d.helpfulCount,
  }));

  return [...community, ...defaults];
}

export function saveCommunityIssue(issue: Issue): Issue {
  const db = readDb();
  db.communityIssues = [issue, ...db.communityIssues.filter((i) => i.id !== issue.id)];
  writeDb(db);
  return issue;
}

export function findIssueById(id: string): Issue | undefined {
  return getAllIssuesMerged().find((i) => i.id === id);
}

export function incrementIssueHelpful(id: string): number | null {
  const existing = findIssueById(id);
  if (!existing) return null;
  const db = readDb();
  const nextCount = (db.helpfulOverrides[id] ?? existing.helpfulCount) + 1;
  db.helpfulOverrides[id] = nextCount;
  const commIdx = db.communityIssues.findIndex((c) => c.id === id);
  if (commIdx !== -1) {
    db.communityIssues[commIdx].helpfulCount = nextCount;
  }
  writeDb(db);
  return nextCount;
}
