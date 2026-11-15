import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  Camera
} from 'lucide-react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SegmentedControl } from './components/SegmentedControl';
import { IssueCard } from './components/IssueCard';
import { IssueDetailModal } from './components/IssueDetailModal';
import { AddIssueModal } from './components/AddIssueModal';
import { CameraDiagnoseModal } from './components/CameraDiagnoseModal';
import { AuthModal } from './components/AuthModal';
import { AdminModerationModal } from './components/AdminModerationModal';
import { Toast } from './components/Toast';

import { Issue, Platform, Category, Severity } from './types/issue';
import { AuthUser } from './types/auth';
import { DEFAULT_ISSUES } from './data/defaultIssues';
import { filterIssues } from './utils/filterIssues';
import { apiFetch, setStoredSessionToken } from './utils/apiClient';
import { firebaseSignOut } from './utils/firebaseAuth';
import {
  DEFAULT_ADMIN_EMAIL,
  canDeleteIssue,
  canModerateIssues,
} from './utils/moderation';

export default function App() {
  // 1. Auth & Issues State (Loaded cleanly with DEFAULT_ISSUES fallback then synced from server)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [issues, setIssues] = useState<Issue[]>(DEFAULT_ISSUES);

  // 2. Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('techcare_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // 3. Voted Helpful State
  const [votedHelpfulIds, setVotedHelpfulIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('techcare_voted');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // 4. Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState<Platform>('all');
  const [currentCategory, setCurrentCategory] = useState<Category>('all');
  const [currentSeverity, setCurrentSeverity] = useState<'all' | Severity>('all');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // 5. Modal and Toast States
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptReason, setAuthPromptReason] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadIssuesFromServer = useCallback(async (userOverride?: AuthUser | null) => {
    const activeUser = userOverride !== undefined ? userOverride : currentUser;
    const url = activeUser?.role === 'admin' ? '/api/issues?scope=all' : '/api/issues';
    try {
      const res = await apiFetch(url);
      if (!res.ok) return;
      const data = (await res.json()) as { issues?: Issue[] };
      if (Array.isArray(data.issues)) {
        setIssues(data.issues);
      }
    } catch {
      // keep fallback issues if offline
    }
  }, [currentUser]);

  // Initial auth + issues sync
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const meRes = await apiFetch('/api/auth/me');
        const meData = meRes.ok ? ((await meRes.json()) as { user?: AuthUser | null }) : { user: null };
        const user = meData.user ?? null;
        if (active) {
          setCurrentUser(user);
          await loadIssuesFromServer(user);
        }
      } catch {
        if (active) {
          await loadIssuesFromServer(null);
        }
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    try {
      localStorage.setItem('techcare_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // storage quota or disabled
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('techcare_voted', JSON.stringify(votedHelpfulIds));
    } catch {
      // storage quota or disabled
    }
  }, [votedHelpfulIds]);

  // Issues shown in the main browse grid (approved items + current user's own flagged/pending items)
  const feedIssues = useMemo(() => {
    return issues.filter((issue) => {
      const status = issue.moderationStatus ?? 'approved';
      if (status === 'approved') return true;
      if (!currentUser) return false;
      return Boolean(
        (issue.authorId && issue.authorId === currentUser.id) ||
          (issue.authorEmail &&
            issue.authorEmail.toLowerCase() === currentUser.email.toLowerCase())
      );
    });
  }, [issues, currentUser]);

  const pendingModerationCount = useMemo(() => {
    if (!canModerateIssues(currentUser)) return 0;
    return issues.filter(
      (i) => i.moderationStatus === 'pending' || i.moderationStatus === 'rejected'
    ).length;
  }, [issues, currentUser]);

  // Platform counts calculation
  const platformCounts = useMemo(() => {
    const counts: Record<Platform, number> = {
      all: feedIssues.length,
      iphone: 0,
      android: 0,
      windows: 0,
      mac: 0,
      hardware: 0,
    };
    for (const issue of feedIssues) {
      if (counts[issue.platform] !== undefined) {
        counts[issue.platform]++;
      }
    }
    return counts;
  }, [feedIssues]);

  // Filtered issues list
  const filteredIssues = useMemo(() => {
    return filterIssues(feedIssues, {
      query: searchQuery,
      platform: currentPlatform,
      category: currentCategory,
      severity: currentSeverity,
      onlyBookmarked: showOnlyBookmarks,
      bookmarkedIds,
    });
  }, [feedIssues, searchQuery, currentPlatform, currentCategory, currentSeverity, showOnlyBookmarks, bookmarkedIds]);

  // Bookmark toggle
  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      setToastMessage(exists ? 'Đã bỏ lưu sự cố khỏi danh sách' : 'Đã lưu sự cố để tra cứu nhanh');
      return next;
    });
  };

  // Vote helpful
  const handleVoteHelpful = async (id: string) => {
    if (votedHelpfulIds.includes(id)) {
      setToastMessage('Bạn đã bình chọn giải pháp này hữu ích rồi!');
      return;
    }
    setIssues((prev) =>
      prev.map((iss) => (iss.id === id ? { ...iss, helpfulCount: iss.helpfulCount + 1 } : iss))
    );
    setVotedHelpfulIds((prev) => [...prev, id]);
    setToastMessage('Cảm ơn bạn đã phản hồi đánh giá hữu ích!');

    try {
      const res = await apiFetch(`/api/issues/${encodeURIComponent(id)}/helpful`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = (await res.json()) as { helpfulCount?: number };
        if (typeof data.helpfulCount === 'number') {
          setIssues((prev) =>
            prev.map((iss) => (iss.id === id ? { ...iss, helpfulCount: data.helpfulCount! } : iss))
          );
        }
      }
    } catch {
      // optimistic count remains
    }
  };

  // Add new issue with server-side Gemini AI moderation
  const handleAddNewIssue = async (newIssue: Issue): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await apiFetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue),
      });
      const data = (await res.json()) as { issue?: Issue; error?: string };
      if (!res.ok || !data.issue) {
        if (res.status === 401) {
          setAuthPromptReason('Vui lòng đăng nhập để đóng góp giải pháp mới.');
          setIsAuthModalOpen(true);
        }
        return { ok: false, error: data.error || 'Không thể lưu đóng góp.' };
      }

      const savedIssue = data.issue;
      setIssues((prev) => [savedIssue, ...prev.filter((i) => i.id !== savedIssue.id)]);
      if (savedIssue.moderationStatus === 'approved') {
        setSelectedIssue(savedIssue);
        setToastMessage('AI đã duyệt và xuất bản giải pháp mới thành công!');
      } else {
        setToastMessage(
          savedIssue.moderationReason ||
            'Bài viết chưa đạt kiểm duyệt tự động (18+/nhạy cảm) và đã chuyển tới Admin xem xét.'
        );
      }
      return { ok: true };
    } catch {
      return { ok: false, error: 'Lỗi kết nối máy chủ khi gửi bài.' };
    }
  };

  const handleModerateIssue = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await apiFetch(`/api/issues/${encodeURIComponent(id)}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json()) as { issue?: Issue; error?: string };
      if (!res.ok || !data.issue) {
        setToastMessage(data.error || 'Không thể cập nhật trạng thái duyệt.');
        return;
      }
      const updated = data.issue;
      setIssues((prev) => prev.map((iss) => (iss.id === updated.id ? updated : iss)));
      if (selectedIssue?.id === updated.id) {
        setSelectedIssue(updated);
      }
      setToastMessage(
        status === 'approved'
          ? 'Admin đã duyệt bài viết hiển thị công khai.'
          : 'Admin đã từ chối / ẩn bài viết này.'
      );
    } catch {
      setToastMessage('Lỗi kết nối khi duyệt bài viết.');
    }
  };

  const handleDeleteIssue = async (id: string) => {
    try {
      const res = await apiFetch(`/api/issues/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setToastMessage(data.error || 'Không thể xóa bài viết.');
        return;
      }
      setIssues((prev) => prev.filter((iss) => iss.id !== id));
      if (selectedIssue?.id === id) {
        setSelectedIssue(null);
      }
      setToastMessage('Đã xóa bài viết khỏi hệ thống.');
    } catch {
      setToastMessage('Lỗi kết nối khi xóa bài viết.');
    }
  };

  const handleAuthSuccess = async (user: AuthUser) => {
    setCurrentUser(user);
    setAuthPromptReason(null);
    await loadIssuesFromServer(user);
    setToastMessage(
      user.role === 'admin'
        ? `Chào Admin ${user.name} (${user.email})! Bạn có toàn quyền duyệt và xóa bài.`
        : `Đăng nhập thành công với tài khoản ${user.name}!`
    );
  };

  const handleLogout = async () => {
    try {
      await Promise.all([
        apiFetch('/api/auth/logout', { method: 'POST' }),
        firebaseSignOut(),
      ]);
    } catch {
      // ignore
    }
    setStoredSessionToken(null);
    setCurrentUser(null);
    setIsAdminModalOpen(false);
    await loadIssuesFromServer(null);
    setToastMessage('Đã đăng xuất khỏi tài khoản.');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-['Manrope'] selection:bg-[#F97316]/30 selection:text-[#F97316]">
      {/* 1. Header */}
      <Header
        currentPlatform={currentPlatform}
        onSelectPlatform={(p) => {
          setCurrentPlatform(p);
          if (showOnlyBookmarks) setShowOnlyBookmarks(false);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        bookmarkCount={bookmarkedIds.length}
        showOnlyBookmarks={showOnlyBookmarks}
        onToggleBookmarks={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
        currentUser={currentUser}
        onOpenAuthModal={() => {
          setAuthPromptReason(null);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        pendingModerationCount={pendingModerationCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 2. Conversational Editorial Hero */}
        <section className="relative pt-4 pb-2">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0E0E0E] border border-[#F97316]/30 text-xs font-mono text-[#F97316]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HỆ THỐNG TRA CỨU SỰ CỐ & GIẢI PHÁP KỸ THUẬT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#FFFFFF] leading-tight font-['Manrope']">
              Chẩn đoán & Xử lý sự cố <br />
              <span className="text-[#F97316]">thiết bị điện tử</span> chính xác.
            </h1>

            <p className="text-sm sm:text-base text-[#A0A0A0] leading-relaxed max-w-2xl font-normal">
              Cẩm nang xử lý lỗi chi tiết từng bước cho iPhone, Android, máy tính Windows và Mac.
              Từ lỗi màn hình xanh, quên mật khẩu, treo đơ máy đến kiểm tra linh kiện chính hãng.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="h-11 px-5 rounded-xl bg-[#F97316] hover:bg-[#FB923C] active:scale-[0.98] text-[#000000] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-[0_2px_18px_rgba(249,115,22,0.35)] cursor-pointer"
              >
                <Camera className="w-4 h-4 stroke-[2.5]" />
                <span>Quét lỗi bằng Camera Gemini</span>
              </button>
              <span className="text-xs text-[#A0A0A0]">
                Gemini chỉ nhận diện lỗi qua ảnh & đề xuất mô-đun để bạn tự fix trên web
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/[0.08]">
            <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/[0.06]">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#F97316]">{feedIssues.length}</div>
              <div className="text-xs text-[#A0A0A0] mt-0.5">Sự cố đã biên tập</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/[0.06]">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#FFFFFF]">100%</div>
              <div className="text-xs text-[#A0A0A0] mt-0.5">Đã test thực tế</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/[0.06]">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#F97316]">5 Phút</div>
              <div className="text-xs text-[#A0A0A0] mt-0.5">Thời gian xử lý TB</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0A0A0A] border border-white/[0.06]">
              <div className="text-xl sm:text-2xl font-bold font-mono text-[#FFFFFF]">Cộng đồng</div>
              <div className="text-xs text-[#A0A0A0] mt-0.5">Đóng góp mở</div>
            </div>
          </div>
        </section>

        {/* 3. Search and Quick Suggestions */}
        <section>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredIssues.length}
            totalCount={feedIssues.length}
          />
        </section>

        {/* 4. Segmented Control Filter Tabs */}
        <section>
          <SegmentedControl
            platform={currentPlatform}
            onChangePlatform={setCurrentPlatform}
            category={currentCategory}
            onChangeCategory={setCurrentCategory}
            severity={currentSeverity}
            onChangeSeverity={setCurrentSeverity}
            platformCounts={platformCounts}
          />
        </section>

        {/* 5. Active Filters Notice (if bookmarks or search active) */}
        {showOnlyBookmarks && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#0E0E0E] border border-[#F97316]/30 text-xs">
            <div className="flex items-center gap-2 text-[#FFFFFF]">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              <span>Đang hiển thị <strong>{bookmarkedIds.length}</strong> bài viết bạn đã đánh dấu lưu trữ.</span>
            </div>
            <button
              onClick={() => setShowOnlyBookmarks(false)}
              className="text-[#F97316] hover:underline font-semibold cursor-pointer"
            >
              Xem tất cả sự cố
            </button>
          </div>
        )}

        {/* 6. Issue Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#FFFFFF] flex items-center gap-2">
              <span>Danh sách sự cố & hướng dẫn</span>
              <span className="text-xs font-mono font-normal text-[#A0A0A0] px-2 py-0.5 rounded bg-[#0A0A0A] border border-white/[0.08]">
                {filteredIssues.length} kết quả
              </span>
            </h2>

            {(searchQuery || currentCategory !== 'all' || currentSeverity !== 'all' || currentPlatform !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPlatform('all');
                  setCurrentCategory('all');
                  setCurrentSeverity('all');
                }}
                className="text-xs text-[#F97316] hover:underline cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

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
            <div className="text-center py-16 px-4 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#141414] border border-white/[0.1] text-[#F97316] flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#FFFFFF]">
                Không tìm thấy sự cố phù hợp với từ khóa
              </h3>
              <p className="text-xs text-[#A0A0A0] max-w-md mx-auto">
                Hãy thử tìm kiếm với các từ khóa ngắn gọn hơn như "màn hình", "pin", "mật khẩu", hoặc thêm lỗi bạn gặp phải vào hệ thống.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentCategory('all');
                    setCurrentPlatform('all');
                    setCurrentSeverity('all');
                    setShowOnlyBookmarks(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] text-xs font-semibold text-[#FFFFFF] border border-white/[0.1] cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#FB923C] text-xs font-bold text-[#000000] cursor-pointer"
                >
                  Đóng góp giải pháp mới
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 7. Community Contribution Banner */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-lg sm:text-xl font-bold text-[#FFFFFF]">
                Bạn vừa giải quyết được một lỗi khó chịu?
              </h3>
              <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                Chia sẻ các bước khắc phục của bạn để giúp đỡ hàng ngàn người dùng khác gặp sự cố tương tự trên thiết bị của họ.
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#F97316] hover:bg-[#FB923C] active:scale-[0.98] text-[#000000] text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_2px_14px_rgba(249,115,22,0.3)] shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm lỗi bạn gặp phải</span>
            </button>
          </div>
        </section>
      </main>

      {/* 8. Editorial Footer */}
      <footer className="mt-16 border-t border-white/[0.08] bg-[#000000] py-12 text-xs text-[#A0A0A0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-[#FFFFFF]">TechCare Knowledge Base</div>
              <p className="text-[11px] text-[#A0A0A0] mt-1">
                Cẩm nang xử lý sự cố thiết bị điện tử — Mã nguồn mở & Hướng dẫn thực nghiệm
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <button onClick={() => setCurrentPlatform('iphone')} className="hover:text-[#F97316] cursor-pointer">iPhone</button>
              <button onClick={() => setCurrentPlatform('android')} className="hover:text-[#F97316] cursor-pointer">Android</button>
              <button onClick={() => setCurrentPlatform('windows')} className="hover:text-[#F97316] cursor-pointer">Windows</button>
              <button onClick={() => setCurrentPlatform('mac')} className="hover:text-[#F97316] cursor-pointer">macOS</button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#666666]">
            <div>© {new Date().getFullYear()} TechCare. Toàn bộ thông tin được tổng hợp từ các chuyên trang công nghệ uy tín.</div>
            <div className="flex items-center gap-4">
              <span>Không có quảng cáo</span>
              <span>•</span>
              <span>Hỗ trợ ngoại tuyến</span>
              <span>•</span>
              <span>Cập nhật 2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Toast */}
      <IssueDetailModal
        key={selectedIssue?.id ?? 'none'}
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        isBookmarked={selectedIssue ? bookmarkedIds.includes(selectedIssue.id) : false}
        onToggleBookmark={() => selectedIssue && handleToggleBookmark(selectedIssue.id)}
        onVoteHelpful={(id) => handleVoteHelpful(id)}
        hasVotedHelpful={selectedIssue ? votedHelpfulIds.includes(selectedIssue.id) : false}
        onShowToast={(msg) => setToastMessage(msg)}
        canDelete={selectedIssue ? canDeleteIssue(selectedIssue, currentUser) : false}
        canModerate={canModerateIssues(currentUser)}
        onDeleteIssue={handleDeleteIssue}
        onModerateIssue={handleModerateIssue}
      />

      <AddIssueModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddIssue={handleAddNewIssue}
        currentUser={currentUser}
        onRequestLogin={() => {
          setAuthPromptReason('Đăng nhập để gửi đóng góp mới (AI sẽ tự động duyệt sau khi gửi).');
          setIsAuthModalOpen(true);
        }}
      />

      <CameraDiagnoseModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        issues={feedIssues}
        onOpenModuleToFix={(issue) => {
          setIsScannerOpen(false);
          setSelectedIssue(issue);
          setToastMessage(`Đã mở mô-đun "${issue.title}" để bạn thực hiện khắc phục.`);
        }}
        onSaveAndOpenModule={async (newIssue) => {
          if (currentUser) {
            const res = await handleAddNewIssue(newIssue);
            if (res.ok) {
              setIsScannerOpen(false);
              return;
            }
          }
          setIssues((prev) => [newIssue, ...prev]);
          setIsScannerOpen(false);
          setSelectedIssue(newIssue);
          setToastMessage('Đã tạo mô-đun mới từ đề xuất của Gemini và mở hướng dẫn khắc phục.');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        promptReason={authPromptReason}
      />

      <AdminModerationModal
        isOpen={isAdminModalOpen && canModerateIssues(currentUser)}
        onClose={() => setIsAdminModalOpen(false)}
        issues={issues}
        adminEmail={currentUser?.email || DEFAULT_ADMIN_EMAIL}
        onModerate={handleModerateIssue}
        onDelete={handleDeleteIssue}
        onInspectIssue={(issue) => {
          setIsAdminModalOpen(false);
          setSelectedIssue(issue);
        }}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
