import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb, 
  Copy, 
  Check, 
  ThumbsUp, 
  Bookmark, 
  ExternalLink,
  Wrench,
  Smartphone,
  Monitor,
  Laptop,
  Cpu,
  Share2,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { Issue } from '../types/issue';

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onVoteHelpful: (id: string) => void;
  hasVotedHelpful: boolean;
  onShowToast: (msg: string) => void;
  canDelete?: boolean;
  canModerate?: boolean;
  onDeleteIssue?: (id: string) => Promise<void>;
  onModerateIssue?: (id: string, status: 'approved' | 'rejected') => Promise<void>;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onVoteHelpful,
  hasVotedHelpful,
  onShowToast,
  canDelete = false,
  canModerate = false,
  onDeleteIssue,
  onModerateIssue,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  if (!issue) return null;

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / issue.steps.length) * 100);

  const handleCopyGuide = () => {
    const textContent = `[TechCare Knowledge Base]
TIÊU ĐỀ: ${issue.title}
NỀN TẢNG: ${issue.platform.toUpperCase()}
THỜI GIAN DỰ KIẾN: ${issue.estimatedTime}

--- DẤU HIỆU & NGUYÊN NHÂN ---
${issue.causes.map((c, i) => `${i + 1}. ${c}`).join('\n')}

--- QUY TRÌNH KHẮC PHỤC CHI TIẾT ---
${issue.steps
  .map(
    (s) =>
      `Bước ${s.stepNumber}: ${s.title}\n${s.instructions}${s.tip ? `\n* Mẹo kỹ thuật: ${s.tip}` : ''}${
        s.warning ? `\n! Cảnh báo: ${s.warning}` : ''
      }`
  )
  .join('\n\n')}

Trích xuất từ Kho Kiến Thức Kỹ Thuật TechCare.`;

    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      onShowToast('Đã sao chép quy trình kỹ thuật vào clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: issue.title,
          text: issue.summary,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      handleCopyGuide();
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'iphone':
        return <Smartphone className="w-5 h-5 text-[#F97316]" />;
      case 'android':
        return <Smartphone className="w-5 h-5 text-[#FB923C]" />;
      case 'windows':
        return <Monitor className="w-5 h-5 text-[#F97316]" />;
      case 'mac':
        return <Laptop className="w-5 h-5 text-[#FB923C]" />;
      default:
        return <Cpu className="w-5 h-5 text-[#F97316]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#000000]/90 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-[#0A0A0A] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/[0.1] z-10"
      >
        {/* Mobile top handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-[#0A0A0A]">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Sticky Top Header */}
        <div className="px-6 sm:px-8 py-4.5 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#0A0A0A] sticky top-0 z-20">
          <div className="flex items-center gap-3 truncate">
            <span className="p-2.5 rounded-xl bg-[#121212] border border-white/[0.08] shrink-0">
              {getPlatformIcon(issue.platform)}
            </span>
            <div className="truncate">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#F97316] font-semibold">
                Quy Trình Khắc Phục Lỗi
              </span>
              <h2 className="text-sm sm:text-base font-bold text-[#FFFFFF] truncate font-['Manrope']">
                {issue.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                isBookmarked
                  ? 'text-[#F97316] bg-[#F97316]/15 border-[#F97316]/40'
                  : 'text-[#A0A0A0] bg-[#121212] border-white/[0.08] hover:text-[#FFFFFF]'
              }`}
              title={isBookmarked ? 'Bỏ lưu' : 'Lưu lại'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl border border-white/[0.08] bg-[#121212] flex items-center justify-center text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              title="Chia sẻ hướng dẫn"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#121212] border border-white/[0.08] hover:bg-[#1E1E1E] flex items-center justify-center text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto px-6 sm:px-8 py-7 space-y-7">
          {/* Main Title & Summary */}
          <div className="space-y-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#FFFFFF] leading-tight font-['Manrope']">
              {issue.title}
            </h1>
            <p className="text-sm text-[#A0A0A0] leading-relaxed font-normal">
              {issue.summary}
            </p>
            {(issue.moderationReason || canModerate || canDelete) && (issue.isUserSubmitted || canDelete) && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                {issue.moderationReason && (
                  <div className="text-xs px-3 py-1.5 rounded-xl bg-[#121212] border border-white/[0.08] text-[#A0A0A0] flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
                    <span>{issue.moderationReason}</span>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                  {canModerate && onModerateIssue && issue.moderationStatus !== 'approved' && (
                    <button
                      type="button"
                      disabled={actionBusy}
                      onClick={async () => {
                        setActionBusy(true);
                        try {
                          await onModerateIssue(issue.id, 'approved');
                        } finally {
                          setActionBusy(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                    >
                      Admin duyệt bài
                    </button>
                  )}
                  {canDelete && onDeleteIssue && (
                    confirmDelete ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={actionBusy}
                          onClick={async () => {
                            setActionBusy(true);
                            try {
                              await onDeleteIssue(issue.id);
                            } finally {
                              setActionBusy(false);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#EF4444] text-[#FFFFFF] text-xs font-bold hover:bg-[#DC2626] cursor-pointer"
                        >
                          Xác nhận xóa
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#121212] border border-white/[0.1] text-xs text-[#A0A0A0] hover:text-[#FFFFFF] cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="px-3 py-1.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/35 text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/25 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa bài</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#121212] border border-white/[0.08] text-xs">
            <div>
              <span className="text-[#A0A0A0] block text-[11px] font-mono uppercase tracking-wider">Thời gian</span>
              <span className="font-semibold text-[#FFFFFF] flex items-center gap-1.5 mt-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#F97316]" />
                {issue.estimatedTime}
              </span>
            </div>
            <div>
              <span className="text-[#A0A0A0] block text-[11px] font-mono uppercase tracking-wider">Độ phức tạp</span>
              <span className="font-semibold text-[#FFFFFF] mt-1 block">
                {issue.severity === 'easy' ? 'Dễ xử lý' : issue.severity === 'medium' ? 'Trung bình' : 'Chuyên sâu'}
              </span>
            </div>
            <div>
              <span className="text-[#A0A0A0] block text-[11px] font-mono uppercase tracking-wider">Số bước</span>
              <span className="font-semibold text-[#FFFFFF] mt-1 block font-mono">
                {issue.steps.length} bước chẩn đoán
              </span>
            </div>
            <div>
              <span className="text-[#A0A0A0] block text-[11px] font-mono uppercase tracking-wider">Tác giả</span>
              <span className="font-semibold text-[#FFFFFF] truncate mt-1 block">
                {issue.author || 'TechCare Engineering'}
              </span>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="p-4 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#A0A0A0]">
              <span className="flex items-center gap-2 text-[#FFFFFF] font-medium">
                <CheckCircle className="w-4 h-4 text-[#F97316]" />
                Tiến độ thực hiện:
              </span>
              <span className="font-bold text-[#F97316] tabular-nums">
                {completedCount} / {issue.steps.length} bước ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#000000] overflow-hidden border border-white/[0.05]">
              <div
                className="h-full bg-[#F97316] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Symptoms & Causes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Symptoms */}
            {issue.symptoms && issue.symptoms.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#121212] border border-white/[0.08]">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#FB923C] mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#FB923C]" />
                  Dấu hiệu nhận diện
                </h3>
                <ul className="space-y-2 text-xs text-[#A0A0A0]">
                  {issue.symptoms.map((sym, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#FB923C] font-bold">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Causes */}
            {issue.causes && issue.causes.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#121212] border border-white/[0.08]">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#F97316] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#F97316]" />
                  Nguyên nhân cốt lõi
                </h3>
                <ul className="space-y-2 text-xs text-[#A0A0A0]">
                  {issue.causes.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#F97316] font-bold">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Required Tools */}
          {issue.requiredTools && issue.requiredTools.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#121212] border border-white/[0.08] flex items-center gap-3 text-xs text-[#A0A0A0]">
              <Wrench className="w-4 h-4 text-[#F97316] shrink-0" />
              <span className="font-mono uppercase tracking-wider text-[#FFFFFF]">Công cụ cần có:</span>
              <span className="text-[#A0A0A0]">{issue.requiredTools.join(' · ')}</span>
            </div>
          )}

          {/* STEP BY STEP RESOLUTION SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-[#FFFFFF] font-['Manrope'] flex items-center gap-2">
                <span>Quy trình xử lý từng bước</span>
                <span className="text-xs font-normal text-[#A0A0A0] hidden sm:inline">
                  (Bấm vào từng bước để ghi nhận tiến độ)
                </span>
              </h3>

              <button
                onClick={handleCopyGuide}
                className="text-xs font-mono font-semibold text-[#F97316] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#F97316]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Chép quy trình'}</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {issue.steps.map((step) => {
                const isDone = !!completedSteps[step.stepNumber];
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`rounded-2xl p-5 border transition-all cursor-pointer select-none ${
                      isDone
                        ? 'bg-[#121212] border-[#F97316]/50 shadow-inner'
                        : 'bg-[#121212] border-white/[0.08] hover:border-white/[0.18] shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox / Step Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStep(step.stepNumber);
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border font-mono cursor-pointer ${
                          isDone
                            ? 'bg-[#F97316] text-[#000000] border-[#F97316]'
                            : 'bg-[#0A0A0A] text-[#A0A0A0] border-white/[0.12] hover:border-[#F97316]'
                        }`}
                        aria-label={`Đánh dấu bước ${step.stepNumber} ${isDone ? 'chưa hoàn thành' : 'đã hoàn thành'}`}
                      >
                        {isDone ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span className="text-xs font-bold">{step.stepNumber}</span>
                        )}
                      </button>

                      {/* Step Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm sm:text-base font-bold transition-colors font-['Manrope'] ${
                              isDone
                                ? 'text-[#F97316] line-through'
                                : 'text-[#FFFFFF]'
                            }`}
                          >
                            Bước {step.stepNumber}: {step.title}
                          </h4>
                          {isDone && (
                            <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#F97316]/15 text-[#F97316]">
                              Đã hoàn thành
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed whitespace-pre-line font-normal">
                          {step.instructions}
                        </p>

                        {/* Tip Callout */}
                        {step.tip && (
                          <div className="mt-3 p-3 rounded-xl bg-[#0A0A0A] border border-[#F97316]/20 flex items-start gap-2.5 text-xs text-[#FB923C]">
                            <Lightbulb className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#F97316]">Mẹo kỹ thuật: </span>
                              <span>{step.tip}</span>
                            </div>
                          </div>
                        )}

                        {/* Warning Callout */}
                        {step.warning && (
                          <div className="mt-3 p-3 rounded-xl bg-[#0A0A0A] border border-[#EF4444]/30 flex items-start gap-2.5 text-xs text-[#EF4444]">
                            <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">Lưu ý an toàn: </span>
                              <span>{step.warning}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reference Link if available */}
          {issue.sourceUrl && (
            <div className="p-4 rounded-2xl bg-[#121212] border border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-[#A0A0A0]">Tài liệu tham khảo kỹ thuật:</span>
              <a
                href={issue.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-semibold text-[#F97316] hover:underline flex items-center gap-1.5"
              >
                <span>Xem tài liệu gốc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-[#0A0A0A] flex items-center justify-between gap-3">
          {/* Helpful vote */}
          <button
            onClick={() => onVoteHelpful(issue.id)}
            disabled={hasVotedHelpful}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all border cursor-pointer ${
              hasVotedHelpful
                ? 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/40'
                : 'bg-[#121212] text-[#A0A0A0] border-white/[0.08] hover:border-[#F97316]/30 hover:text-[#FFFFFF]'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasVotedHelpful ? 'fill-current' : ''}`} />
            <span>{hasVotedHelpful ? 'Đã hữu ích' : 'Hữu ích'}</span>
            <span className="font-mono font-bold">({issue.helpfulCount + (hasVotedHelpful ? 1 : 0)})</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyGuide}
              className="px-4 py-2 rounded-xl border border-white/[0.08] bg-[#121212] text-[#A0A0A0] hover:text-[#FFFFFF] text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#F97316]" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-[#F97316] hover:bg-[#ff8533] text-[#000000] text-xs sm:text-sm font-bold transition-all shadow-[0_2px_12px_rgba(249,115,22,0.25)] cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
