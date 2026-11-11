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
  Share2
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
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onVoteHelpful,
  hasVotedHelpful,
  onShowToast,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

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
    const textContent = `[TechCare Professional Archive]
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
        return <Smartphone className="w-5 h-5 text-[#B8C7A1]" />;
      case 'android':
        return <Smartphone className="w-5 h-5 text-[#A6B39B]" />;
      case 'windows':
        return <Monitor className="w-5 h-5 text-[#B8C7A1]" />;
      case 'mac':
        return <Laptop className="w-5 h-5 text-[#A6B39B]" />;
      default:
        return <Cpu className="w-5 h-5 text-[#B8C7A1]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#10110F]/85 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Sheet Container */}
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-[#171916] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/[0.12] z-10"
      >
        {/* Mobile top handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-[#171916]">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Sticky Top Header */}
        <div className="px-6 sm:px-8 py-4.5 border-b border-white/[0.08] flex items-center justify-between gap-4 bg-[#171916] sticky top-0 z-20">
          <div className="flex items-center gap-3 truncate">
            <span className="p-2.5 rounded-xl bg-[#1D211D] border border-white/[0.09] shrink-0">
              {getPlatformIcon(issue.platform)}
            </span>
            <div className="truncate">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#B8C7A1] font-semibold">
                Quy Trình Khắc Phục Lỗi
              </span>
              <h2 className="text-sm sm:text-base font-bold text-[#F2F1EB] truncate font-['Manrope']">
                {issue.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
                isBookmarked
                  ? 'text-[#B8C7A1] bg-[#B8C7A1]/15 border-[#B8C7A1]/30'
                  : 'text-[#A2A69D] bg-[#1D211D] border-white/[0.08] hover:text-[#F2F1EB]'
              }`}
              title={isBookmarked ? 'Bỏ lưu' : 'Lưu lại'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl border border-white/[0.08] bg-[#1D211D] flex items-center justify-center text-[#A2A69D] hover:text-[#F2F1EB] transition-colors"
              title="Chia sẻ hướng dẫn"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#1D211D] border border-white/[0.08] hover:bg-[#252b24] flex items-center justify-center text-[#A2A69D] hover:text-[#F2F1EB] transition-colors"
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
            <h1 className="text-xl sm:text-2xl font-bold text-[#F2F1EB] leading-tight font-['Manrope']">
              {issue.title}
            </h1>
            <p className="text-sm text-[#A2A69D] leading-relaxed font-normal">
              {issue.summary}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#1D211D] border border-white/[0.08] text-xs">
            <div>
              <span className="text-[#A2A69D] block text-[11px] font-mono uppercase tracking-wider">Thời gian</span>
              <span className="font-semibold text-[#F2F1EB] flex items-center gap-1.5 mt-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-[#B8C7A1]" />
                {issue.estimatedTime}
              </span>
            </div>
            <div>
              <span className="text-[#A2A69D] block text-[11px] font-mono uppercase tracking-wider">Độ phức tạp</span>
              <span className="font-semibold text-[#F2F1EB] mt-1 block">
                {issue.severity === 'easy' ? 'Dễ xử lý' : issue.severity === 'medium' ? 'Trung bình' : 'Chuyên sâu'}
              </span>
            </div>
            <div>
              <span className="text-[#A2A69D] block text-[11px] font-mono uppercase tracking-wider">Số bước</span>
              <span className="font-semibold text-[#F2F1EB] mt-1 block font-mono">
                {issue.steps.length} bước chẩn đoán
              </span>
            </div>
            <div>
              <span className="text-[#A2A69D] block text-[11px] font-mono uppercase tracking-wider">Tác giả</span>
              <span className="font-semibold text-[#F2F1EB] truncate mt-1 block">
                {issue.author || 'TechCare Engineering'}
              </span>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="p-4 rounded-2xl bg-[#1D211D] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#A2A69D]">
              <span className="flex items-center gap-2 text-[#F2F1EB] font-medium">
                <CheckCircle className="w-4 h-4 text-[#B8C7A1]" />
                Tiến độ thực hiện:
              </span>
              <span className="font-bold text-[#B8C7A1] tabular-nums">
                {completedCount} / {issue.steps.length} bước ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#10110F] overflow-hidden border border-white/[0.05]">
              <div
                className="h-full bg-[#B8C7A1] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Symptoms & Causes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Symptoms */}
            {issue.symptoms && issue.symptoms.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#1D211D] border border-white/[0.08]">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#E0C097] mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#E0C097]" />
                  Dấu hiệu nhận diện
                </h3>
                <ul className="space-y-2 text-xs text-[#A2A69D]">
                  {issue.symptoms.map((sym, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#E0C097] font-bold">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Causes */}
            {issue.causes && issue.causes.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#1D211D] border border-white/[0.08]">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8C7A1] mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#B8C7A1]" />
                  Nguyên nhân cốt lõi
                </h3>
                <ul className="space-y-2 text-xs text-[#A2A69D]">
                  {issue.causes.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#B8C7A1] font-bold">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Required Tools */}
          {issue.requiredTools && issue.requiredTools.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#1D211D] border border-white/[0.08] flex items-center gap-3 text-xs text-[#A2A69D]">
              <Wrench className="w-4 h-4 text-[#B8C7A1] shrink-0" />
              <span className="font-mono uppercase tracking-wider text-[#F2F1EB]">Công cụ cần có:</span>
              <span className="text-[#A2A69D]">{issue.requiredTools.join(' · ')}</span>
            </div>
          )}

          {/* STEP BY STEP RESOLUTION SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-[#F2F1EB] font-['Manrope'] flex items-center gap-2">
                <span>Quy trình xử lý từng bước</span>
                <span className="text-xs font-normal text-[#A2A69D] hidden sm:inline">
                  (Bấm vào từng bước để ghi nhận tiến độ)
                </span>
              </h3>

              <button
                onClick={handleCopyGuide}
                className="text-xs font-mono font-semibold text-[#B8C7A1] hover:underline flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#B8C7A1]" /> : <Copy className="w-3.5 h-3.5" />}
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
                        ? 'bg-[#1D211D] border-[#B8C7A1]/50 shadow-inner'
                        : 'bg-[#1D211D] border-white/[0.08] hover:border-white/[0.2] shadow-sm'
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
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors border font-mono ${
                          isDone
                            ? 'bg-[#B8C7A1] text-[#10110F] border-[#B8C7A1]'
                            : 'bg-[#171916] text-[#A2A69D] border-white/[0.12] hover:border-[#B8C7A1]'
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
                                ? 'text-[#B8C7A1] line-through'
                                : 'text-[#F2F1EB]'
                            }`}
                          >
                            Bước {step.stepNumber}: {step.title}
                          </h4>
                          {isDone && (
                            <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#B8C7A1]/15 text-[#B8C7A1]">
                              Đã hoàn thành
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-[#A2A69D] leading-relaxed whitespace-pre-line font-normal">
                          {step.instructions}
                        </p>

                        {/* Tip Callout */}
                        {step.tip && (
                          <div className="mt-3 p-3 rounded-xl bg-[#171916] border border-[#B8C7A1]/20 flex items-start gap-2.5 text-xs text-[#A6B39B]">
                            <Lightbulb className="w-4 h-4 text-[#B8C7A1] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#B8C7A1]">Mẹo kỹ thuật: </span>
                              <span>{step.tip}</span>
                            </div>
                          </div>
                        )}

                        {/* Warning Callout */}
                        {step.warning && (
                          <div className="mt-3 p-3 rounded-xl bg-[#171916] border border-[#E07A5F]/30 flex items-start gap-2.5 text-xs text-[#E07A5F]">
                            <AlertTriangle className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
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
            <div className="p-4 rounded-2xl bg-[#1D211D] border border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-[#A2A69D]">Tài liệu tham khảo kỹ thuật:</span>
              <a
                href={issue.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-semibold text-[#B8C7A1] hover:underline flex items-center gap-1.5"
              >
                <span>Xem tài liệu gốc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-[#171916] flex items-center justify-between gap-3">
          {/* Helpful vote */}
          <button
            onClick={() => onVoteHelpful(issue.id)}
            disabled={hasVotedHelpful}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all border ${
              hasVotedHelpful
                ? 'bg-[#B8C7A1]/15 text-[#B8C7A1] border-[#B8C7A1]/40'
                : 'bg-[#1D211D] text-[#A2A69D] border-white/[0.08] hover:border-[#B8C7A1]/30 hover:text-[#F2F1EB]'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasVotedHelpful ? 'fill-current' : ''}`} />
            <span>{hasVotedHelpful ? 'Đã hữu ích' : 'Hữu ích'}</span>
            <span className="font-mono font-bold">({issue.helpfulCount + (hasVotedHelpful ? 1 : 0)})</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyGuide}
              className="px-4 py-2 rounded-xl border border-white/[0.09] bg-[#1D211D] text-[#A2A69D] hover:text-[#F2F1EB] text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-[#B8C7A1]" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-[#B8C7A1] hover:bg-[#c7d5b1] text-[#10110F] text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
