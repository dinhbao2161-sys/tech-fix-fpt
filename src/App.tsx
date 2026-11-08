/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wrench, 
  Plus, 
  Smartphone, 
  Monitor, 
  Laptop, 
  Cpu, 
  HelpCircle,
  Sparkles,
  Search,
  CheckCircle2,
  Bookmark,
  Share2
} from 'lucide-react';
import { Issue, Platform, Category, Severity } from './types/issue';
import { DEFAULT_ISSUES } from './data/defaultIssues';
import { filterIssues } from './utils/filterIssues';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SegmentedControl } from './components/SegmentedControl';
import { IssueCard } from './components/IssueCard';
import { IssueDetailModal } from './components/IssueDetailModal';
import { AddIssueModal } from './components/AddIssueModal';
import { Toast } from './components/Toast';

export default function App() {
  // 1. Issues state with LocalStorage persistence
  const [issues, setIssues] = useState<Issue[]>(() => {
    try {
      const saved = localStorage.getItem('techcare_issues_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to defaults
    }
    return DEFAULT_ISSUES;
  });

  // 2. Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | Severity>('all');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // 3. User Bookmarks & Helpful reactions
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('techcare_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [helpfulVotedIds, setHelpfulVotedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('techcare_helpful_voted');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 4. Modals & UI States
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 5. Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('techcare_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync dark mode class on document.documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('techcare_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('techcare_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('techcare_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {}
  }, [bookmarkedIds]);

  // Sync helpful votes
  useEffect(() => {
    try {
      localStorage.setItem('techcare_helpful_voted', JSON.stringify(helpfulVotedIds));
    } catch {}
  }, [helpfulVotedIds]);

  // Sync issues
  useEffect(() => {
    try {
      localStorage.setItem('techcare_issues_v1', JSON.stringify(issues));
    } catch {}
  }, [issues]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Platform issue counts
  const platformCounts = useMemo(() => {
    const counts: Record<Platform, number> = {
      all: issues.length,
      iphone: 0,
      android: 0,
      windows: 0,
      mac: 0,
      hardware: 0,
    };
    issues.forEach((item) => {
      if (counts[item.platform] !== undefined) {
        counts[item.platform]++;
      }
    });
    return counts;
  }, [issues]);

  // Filtered issues list
  const filteredIssues = useMemo(() => {
    return filterIssues(issues, {
      query: searchQuery,
      platform: selectedPlatform,
      category: selectedCategory,
      severity: selectedSeverity,
      onlyBookmarked: showOnlyBookmarks,
      bookmarkedIds,
    });
  }, [issues, searchQuery, selectedPlatform, selectedCategory, selectedSeverity, showOnlyBookmarks, bookmarkedIds]);

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Đã bỏ lưu bài viết khỏi danh sách yêu thích.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Đã lưu bài viết vào danh sách yêu thích!');
        return [...prev, id];
      }
    });
  };

  const handleVoteHelpful = (id: string) => {
    if (helpfulVotedIds.includes(id)) return;
    setHelpfulVotedIds((prev) => [...prev, id]);
    setIssues((prev) =>
      prev.map((item) => (item.id === id ? { ...item, helpfulCount: item.helpfulCount + 1 } : item))
    );
    showToast('Cảm ơn bạn đã phản hồi! Đánh giá đã được ghi nhận.');
  };

  const handleAddIssue = (newIssue: Issue) => {
    setIssues((prev) => [newIssue, ...prev]);
    showToast('Đã đăng tải thành công mẹo xử lý lỗi của bạn!');
    setSelectedPlatform(newIssue.platform);
    setSelectedCategory('all');
    setSelectedIssue(newIssue);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedCategory('all');
    setSelectedSeverity('all');
    setShowOnlyBookmarks(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* Dynamic Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Header */}
      <Header
        currentPlatform={selectedPlatform}
        onSelectPlatform={(p) => {
          setSelectedPlatform(p);
          if (showOnlyBookmarks) setShowOnlyBookmarks(false);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        bookmarkCount={bookmarkedIds.length}
        showOnlyBookmarks={showOnlyBookmarks}
        onToggleBookmarks={() => setShowOnlyBookmarks((prev) => !prev)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section with iOS Cupertino Blur */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 ios-glass border border-white/60 dark:border-white/10 shadow-lg">
          {/* Subtle background ambient gradients */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-500 text-white">
                <Wrench className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Cẩm Nang Khắc Phục Sự Cố Thiết Bị Toàn Diện
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Tra cứu giải pháp sửa lỗi iPhone, Android & Windows
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Tổng hợp chi tiết các bước xử lý lỗi thường gặp như Windows màn hình xanh (BSOD), điện thoại Android bị treo đơ, quên mật khẩu iPhone, kiểm tra linh kiện chính hãng, lỗi mất âm thanh và Wi-Fi.
            </p>

            {/* Search Bar */}
            <div className="pt-2">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                resultCount={filteredIssues.length}
                totalCount={issues.length}
              />
            </div>
          </div>
        </div>

        {/* Filter Controls (Segmented Control + Category Chips) */}
        <section aria-label="Bộ lọc thiết bị và danh mục">
          <SegmentedControl
            platform={selectedPlatform}
            onChangePlatform={setSelectedPlatform}
            category={selectedCategory}
            onChangeCategory={setSelectedCategory}
            severity={selectedSeverity}
            onChangeSeverity={setSelectedSeverity}
            platformCounts={platformCounts}
          />
        </section>

        {/* Bookmark filter active indicator banner */}
        {showOnlyBookmarks && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">
              <Bookmark className="w-4 h-4 fill-current text-amber-500" />
              <span>
                Đang hiển thị {filteredIssues.length} bài viết bạn đã lưu vào mục yêu thích.
              </span>
            </div>
            <button
              onClick={() => setShowOnlyBookmarks(false)}
              className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline shrink-0"
            >
              Hiện tất cả bài viết
            </button>
          </div>
        )}

        {/* Results Grid ("những lỗi sẽ được phân luồng ra thành từng ô một") */}
        <section aria-label="Danh sách các lỗi và giải pháp">
          {filteredIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onClick={() => setSelectedIssue(issue)}
                  isBookmarked={bookmarkedIds.includes(issue.id)}
                  onToggleBookmark={(e) => handleToggleBookmark(issue.id, e)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl p-12 text-center ios-glass border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Không tìm thấy lỗi phù hợp
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Không có kết quả nào khớp với từ khóa "{searchQuery}" trong bộ lọc hiện tại. Hãy thử tìm với từ khóa khác hoặc đóng góp mẹo mới!
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-300 transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Đóng góp lỗi & cách fix
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          isBookmarked={bookmarkedIds.includes(selectedIssue.id)}
          onToggleBookmark={() => handleToggleBookmark(selectedIssue.id)}
          onVoteHelpful={handleVoteHelpful}
          hasVotedHelpful={helpfulVotedIds.includes(selectedIssue.id)}
          onShowToast={showToast}
        />
      )}

      {/* Add Issue Modal */}
      <AddIssueModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddIssue={handleAddIssue}
      />
    </div>
  );
}
