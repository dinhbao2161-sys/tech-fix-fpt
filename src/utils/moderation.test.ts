import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_ADMIN_EMAIL,
  isAdminEmail,
  canModerateIssues,
  canDeleteIssue,
  canViewIssuePublicly,
  parseModerationResponse,
} from './moderation.ts';
import type { AuthUser } from '../types/auth.ts';
import type { Issue } from '../types/issue.ts';

const adminUser: AuthUser = {
  id: 'u-admin',
  email: DEFAULT_ADMIN_EMAIL,
  name: 'Admin Dinh Bao',
  provider: 'google',
  role: 'admin',
};

const regularUser: AuthUser = {
  id: 'u-123',
  email: 'member@example.com',
  name: 'Thanh Vien',
  provider: 'password',
  role: 'user',
};

const otherUser: AuthUser = {
  id: 'u-999',
  email: 'other@example.com',
  name: 'Nguoi Khac',
  provider: 'password',
  role: 'user',
};

const baseIssue: Issue = {
  id: 'custom-1',
  title: 'Sửa lỗi iPhone nóng máy',
  platform: 'iphone',
  category: 'battery',
  severity: 'easy',
  estimatedTime: '5 phút',
  summary: 'Tóm tắt lỗi nóng máy khi sạc.',
  symptoms: ['Máy ấm'],
  causes: ['Dùng sạc kém chất lượng'],
  steps: [{ stepNumber: 1, title: 'Đổi cáp', instructions: 'Dùng cáp chính hãng.' }],
  tags: ['iphone'],
  author: 'Thanh Vien',
  authorId: 'u-123',
  authorEmail: 'member@example.com',
  createdAt: '2026-11-14',
  helpfulCount: 1,
  isUserSubmitted: true,
  moderationStatus: 'approved',
};

test('isAdminEmail matches case-insensitively and ignores whitespace', () => {
  assert.equal(isAdminEmail('  DinhBao2161@GMAIL.com '), true);
  assert.equal(isAdminEmail('someone@gmail.com'), false);
  assert.equal(isAdminEmail(null), false);
});

test('canModerateIssues only allows admin role', () => {
  assert.equal(canModerateIssues(adminUser), true);
  assert.equal(canModerateIssues(regularUser), false);
  assert.equal(canModerateIssues(null), false);
});

test('canDeleteIssue grants admin deletion on any issue and limits regular users to own submissions', () => {
  const builtInIssue: Issue = { ...baseIssue, id: 'win-bsod', isUserSubmitted: false, authorId: undefined, authorEmail: undefined };
  assert.equal(canDeleteIssue(builtInIssue, adminUser), true);
  assert.equal(canDeleteIssue(builtInIssue, regularUser), false);
  assert.equal(canDeleteIssue(baseIssue, regularUser), true);
  assert.equal(canDeleteIssue(baseIssue, otherUser), false);
  assert.equal(canDeleteIssue(baseIssue, null), false);
});

test('canViewIssuePublicly hides pending/rejected posts from guests and unrelated users', () => {
  const rejectedIssue: Issue = { ...baseIssue, moderationStatus: 'rejected' };
  assert.equal(canViewIssuePublicly(rejectedIssue, null), false);
  assert.equal(canViewIssuePublicly(rejectedIssue, otherUser), false);
  assert.equal(canViewIssuePublicly(rejectedIssue, regularUser), true);
  assert.equal(canViewIssuePublicly(rejectedIssue, adminUser), true);
});

test('parseModerationResponse approves clean tech content and rejects 18+ or sensitive content', () => {
  const clean = parseModerationResponse(
    '```json\n{"approved": true, "isAdult18Plus": false, "isSensitiveContent": false, "reason": "Bài hướng dẫn sửa lỗi kỹ thuật hợp lệ.", "flags": []}\n```'
  );
  assert.equal(clean.approved, true);
  assert.equal(clean.status, 'approved');

  const nsfw = parseModerationResponse(
    JSON.stringify({
      approved: true, // even if model contradicts itself, flags force rejection
      isAdult18Plus: true,
      isSensitiveContent: false,
      reason: 'Chứa nội dung 18+.',
      flags: ['18+'],
    })
  );
  assert.equal(nsfw.approved, false);
  assert.equal(nsfw.status, 'rejected');
  assert.deepEqual(nsfw.flags, ['18+']);
});
