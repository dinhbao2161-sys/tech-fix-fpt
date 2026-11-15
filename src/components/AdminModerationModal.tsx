import React, { useMemo, useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Sparkles,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Issue } from '../types/issue';

interface AdminModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: Issue[];
  adminEmail: string;
  onModerate: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onInspectIssue: (issue: Issue) => void;
}

type AdminTab = 'needs_review' | 'community' | 'all';

export const AdminModerationModal: React.FC<AdminModerationModalProps> = ({
  isOpen,
  onClose,
  issues,
  adminEmail,
  onModerate,
  onDelete,
  onInspectIssue,
}) => {
  const [tab, setTab] = useState<AdminTab>('needs_review');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const needsReviewList = useMemo(
    () =>
      issues.filter(
        (i) => i.moderationStatus === 'pending' || i.moderationStatus === 'rejected'
      ),
    [issues]
  );

  const communityList = useMemo(
    () => issues.filter((i) => Boolean(i.isUserSubmitted)),
    [issues]
  );

  const displayedList = useMemo(() => {
    if (tab === 'needs_review') return needsReviewList;
    if (tab === 'community') return communityList;
    return issues;
  }, [tab, needsReviewList, communityList, issues]);

  if (!isOpen) return null;

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    setBusyId(id);
    try {
      await onModerate(id, status);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await onDelete(id);
      setConfirmDeleteId(null);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#000000]/90 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#0A0A0A] rounded-t-3xl sm:rounded-3xl border border-white/[0.1] shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-[#F97316]/15 border border-[#F97316]/40 text-[#F97316]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="admin-modal-title" className="text-base font-bold text-[#FFFFFF] font-['Manrope']">
                  Bảng Điều Khiển Quản Trị (Admin)
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30">
                  {adminEmail}
                </span>
              </div>
              <p className="text-xs text-[#A0A0A0] mt-0.5">
                AI tự động duyệt bài sạch (chỉ chặn 18+ &amp; nhạy cảm). Admin toàn quyền duyệt thủ công và xóa bài.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#121212] border border-white/[0.08] hover:bg-[#1E1E1E] flex items-center justify-center text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            aria-label="Đóng bảng quản trị"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 sm:px-8 py-3.5 border-b border-white/[0.08] bg-[#0E0E0E] flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('needs_review')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              tab === 'needs_review'
                ? 'bg-[#F97316] text-[#000000] border-[#F97316]'
                : 'bg-[#121212] text-[#A0A0A0] border-white/[0.08] hover:text-[#FFFFFF]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Chờ duyệt / AI chặn</span>
            <span className="font-mono text-[11px] px-1.5 rounded bg-black/20">
              {needsReviewList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('community')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              tab === 'community'
                ? 'bg-[#F97316] text-[#000000] border-[#F97316]'
                : 'bg-[#121212] text-[#A0A0A0] border-white/[0.08] hover:text-[#FFFFFF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đóng góp cộng đồng</span>
            <span className="font-mono text-[11px] px-1.5 rounded bg-black/20">
              {communityList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
              tab === 'all'
                ? 'bg-[#F97316] text-[#000000] border-[#F97316]'
                : 'bg-[#121212] text-[#A0A0A0] border-white/[0.08] hover:text-[#FFFFFF]'
            }`}
          >
            <span>Tất cả bài viết</span>
            <span className="font-mono text-[11px] px-1.5 rounded bg-black/20">
              {issues.length}
            </span>
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-4">
          {displayedList.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#F97316] mx-auto" />
              <div className="text-sm font-bold text-[#FFFFFF]">
                Không có bài viết nào trong mục này
              </div>
              <p className="text-xs text-[#A0A0A0]">
                Các bài đóng góp hợp lệ sẽ được AI Gemini tự động duyệt hiển thị ngay lập tức.
              </p>
            </div>
          ) : (
            displayedList.map((item) => {
              const status = item.moderationStatus ?? 'approved';
              const isBusy = busyId === item.id;
              const isConfirmingDelete = confirmDeleteId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {status === 'approved' && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {item.moderatedBy === 'admin'
                              ? 'Admin đã duyệt'
                              : item.isUserSubmitted
                                ? 'AI đã duyệt'
                                : 'Hệ thống'}
                          </span>
                        )}
                        {status === 'pending' && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Chờ duyệt
                          </span>
                        )}
                        {status === 'rejected' && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                            Bị từ chối / Ẩn
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-[#A0A0A0] uppercase">
                          {item.platform}
                        </span>
                        <span className="text-[11px] text-[#666666]">•</span>
                        <span className="text-[11px] text-[#A0A0A0]">
                          {item.author}
                          {item.authorEmail ? ` (${item.authorEmail})` : ''}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#FFFFFF] font-['Manrope']">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#A0A0A0] line-clamp-2">{item.summary}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onInspectIssue(item)}
                        className="h-8 px-3 rounded-lg bg-[#0A0A0A] border border-white/[0.1] text-xs text-[#FFFFFF] hover:border-[#F97316]/50 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>Xem</span>
                      </button>

                      {status !== 'approved' && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleModerate(item.id, 'approved')}
                          className="h-8 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Duyệt</span>
                        </button>
                      )}

                      {item.isUserSubmitted && status !== 'rejected' && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleModerate(item.id, 'rejected')}
                          className="h-8 px-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300 hover:bg-amber-500/25 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Từ chối</span>
                        </button>
                      )}

                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(item.id)}
                            className="h-8 px-3 rounded-lg bg-[#EF4444] text-[#FFFFFF] text-xs font-bold hover:bg-[#DC2626] disabled:opacity-50 cursor-pointer"
                          >
                            Xác nhận xóa
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="h-8 px-2.5 rounded-lg bg-[#0A0A0A] border border-white/[0.1] text-xs text-[#A0A0A0] hover:text-[#FFFFFF] cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="h-8 px-3 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/35 text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/25 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa bài</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {item.moderationReason && (
                    <div className="p-2.5 rounded-xl bg-[#0A0A0A] border border-white/[0.06] text-[11px] text-[#A0A0A0]">
                      <strong className="text-[#F97316] font-mono uppercase">Kiểm duyệt: </strong>
                      {item.moderationReason}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
