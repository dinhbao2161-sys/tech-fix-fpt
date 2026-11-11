/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Terminal, 
  Plus, 
  Bookmark, 
  Search,
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  ArrowUpRight
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
        showToast('Đã gỡ bài viết khỏi danh sách lưu trữ.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Đã lưu bài viết vào kho lưu trữ cá nhân.');
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
    showToast('Đánh giá hữu ích đã được ghi nhận.');
  };

  const handleAddIssue = (newIssue: Issue) => {
    setIssues((prev) => [newIssue, ...prev]);
    showToast('Đã xuất bản thành công giải pháp mới vào hệ thống.');
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
    <div className="min-h-screen bg-[#10110F] text-[#F2F1EB] selection:bg-[#B8C7A1] selection:text-[#10110F] font-['Manrope'] transition-colors">
      {/* Subtle sage ambient lighting at the very top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] luxury-sage-ambient pointer-events-none" />

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
        bookmarkCount={bookmarkedIds.length}
        showOnlyBookmarks={showOnlyBookmarks}
        onToggleBookmarks={() => setShowOnlyBookmarks((prev) => !prev)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 relative z-10">
        {/* Hero Section: Dark Luxury Editorial & Asymmetric Layout */}
        <section className="relative rounded-3xl p-7 sm:p-12 bg-[#171916] border border-white/[0.09] shadow-2xl overflow-hidden">
          {/* Subtle tech grid background */}
          <div className="absolute inset-0 luxury-grid-bg opacity-40 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (8 cols): Editorial Typography & Search */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1D211D] border border-white/[0.09]">
                <span className="w-2 h-2 rounded-full bg-[#B8C7A1]" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#B8C7A1] font-semibold">
                  Hệ Thống Chẩn Đoán Kỹ Thuật Độc Lập
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F2F1EB] leading-[1.15] font-['Manrope']">
                Kho tri thức giải pháp sửa chữa & chẩn đoán thiết bị
              </h1>

              <p className="text-sm sm:text-base text-[#A2A69D] leading-relaxed max-w-2xl font-normal">
                Hệ thống tổng hợp chuẩn xác các quy trình xử lý sự cố phần cứng và hệ điều hành: Windows màn hình xanh (BSOD), điện thoại Android bị treo đơ, mở khóa mật khẩu iPhone, kiểm tra linh kiện chính hãng và tối ưu hiệu suất.
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

            {/* Right Column (4 cols): Luxury Tech Metrics Strip (Asymmetric Editorial) */}
            <div className="lg:col-span-4 flex flex-col gap-3.5 border-t lg:border-t-0 lg:border-l border-white/[0.09] pt-6 lg:pt-0 lg:pl-8">
              <div className="p-4 rounded-2xl bg-[#1D211D] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#A2A69D] uppercase tracking-wider block">
                    Quy trình kiểm định
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#F2F1EB] mt-0.5 block tabular-nums">
                    {issues.length} Đề Mục
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#171916] border border-white/[0.08] flex items-center justify-center text-[#B8C7A1]">
                  <Cpu className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1D211D] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#A2A69D] uppercase tracking-wider block">
                    Tiêu chuẩn kỹ thuật
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#B8C7A1] mt-0.5 block tabular-nums">
                    100% Chính Xác
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#171916] border border-white/[0.08] flex items-center justify-center text-[#B8C7A1]">
                  <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1D211D] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-[#A2A69D] uppercase tracking-wider block">
                    Nền tảng hỗ trợ
                  </span>
                  <span className="text-sm font-bold text-[#F2F1EB] mt-1 block">
                    iOS · Android · Windows · Mac
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#171916] border border-white/[0.08] flex items-center justify-center text-[#B8C7A1]">
                  <Layers className="w-5 h-5 stroke-[1.8]" />
                </div>
              </div>
            </div>
          </div>
        </section>

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
          <div className="p-4 rounded-2xl bg-[#171916] border border-[#B8C7A1]/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#F2F1EB]">
              <Bookmark className="w-4 h-4 fill-current text-[#B8C7A1]" />
              <span>
                Đang lọc hiển thị {filteredIssues.length} quy trình kỹ thuật bạn đã lưu trữ cá nhân.
              </span>
            </div>
            <button
              onClick={() => setShowOnlyBookmarks(false)}
              className="text-xs font-mono font-semibold text-[#B8C7A1] hover:underline shrink-0"
            >
              Hiện tất cả đề mục
            </button>
          </div>
        )}

        {/* Results Grid (Dark Luxury Tech Cards) */}
        <section aria-label="Danh sách các lỗi và giải pháp">
          {filteredIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="rounded-3xl p-14 text-center bg-[#171916] border border-white/[0.09] space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#1D211D] border border-white/[0.08] flex items-center justify-center mx-auto text-[#B8C7A1]">
                <Search className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-bold text-[#F2F1EB] font-['Manrope']">
                  Không tìm thấy đề mục tương ứng
                </h3>
                <p className="text-xs sm:text-sm text-[#A2A69D] leading-relaxed">
                  Không có kết quả nào khớp với cụm từ "{searchQuery}" trong bộ lọc hiện thời. Bạn có thể xóa bộ lọc hoặc trực tiếp đóng góp giải pháp mới.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2.5 rounded-xl bg-[#1D211D] border border-white/[0.09] text-[#A2A69D] hover:text-[#F2F1EB] text-xs font-mono font-medium transition-colors"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#B8C7A1] text-[#10110F] text-xs font-bold hover:bg-[#c7d5b1] transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Đóng góp giải pháp mới
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Editorial Architecture Footer */}
        <footer className="pt-10 pb-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A2A69D]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8C7A1]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#F2F1EB]">
              TechCare Engineering Knowledge Base
            </span>
            <span className="text-white/20">/</span>
            <span>Phiên bản Dark Luxury Editorial</span>
          </div>

          <div className="font-mono text-[11px] text-[#A2A69D]/80">
            Dữ liệu kỹ thuật chuẩn đoán độc lập · Bản quyền 2026
          </div>
        </footer>
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
