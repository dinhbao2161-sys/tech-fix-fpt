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
  User,
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
    const textContent = `[TechCare] HƯỚNG DẪN XỬ LÝ: ${issue.title}
Thiết bị: ${issue.platform.toUpperCase()}
Thời gian ước tính: ${issue.estimatedTime}

--- NGUYÊN NHÂN ---
${issue.causes.map((c, i) => `${i + 1}. ${c}`).join('\n')}

--- CÁC BƯỚC KHẮC PHỤC ---
${issue.steps
  .map(
    (s) =>
      `Bước ${s.stepNumber}: ${s.title}\n${s.instructions}${s.tip ? `\n* Mẹo: ${s.tip}` : ''}${
        s.warning ? `\n! Lưu ý: ${s.warning}` : ''
      }`
  )
  .join('\n\n')}

Được tổng hợp bởi TechCare - Cẩm nang sửa chữa thiết bị điện tử.`;

    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      onShowToast('Đã sao chép toàn bộ hướng dẫn vào bộ nhớ tạm!');
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
        return <Smartphone className="w-5 h-5 text-slate-900 dark:text-slate-100" />;
      case 'android':
        return <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'windows':
        return <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'mac':
        return <Laptop className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Sheet Container */}
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80 dark:border-slate-800 z-10 animate-in fade-in slide-in-from-bottom duration-200"
      >
        {/* iOS Drag Handle on Mobile */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Sticky Top Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2.5 truncate">
            <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
              {getPlatformIcon(issue.platform)}
            </span>
            <div className="truncate">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Hướng Dẫn Khắc Phục Lỗi
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {issue.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bookmark button */}
            <button
              onClick={onToggleBookmark}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isBookmarked ? 'Bỏ lưu' : 'Lưu lại'}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Chia sẻ hướng dẫn"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto px-5 sm:px-7 py-6 space-y-6">
          {/* Main Title & Summary */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight mb-2">
              {issue.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {issue.summary}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Thời gian ước tính</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {issue.estimatedTime}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Độ phức tạp</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {issue.severity === 'easy' ? 'Dễ xử lý' : issue.severity === 'medium' ? 'Vừa phải' : 'Nâng cao'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Số bước thực hiện</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                {issue.steps.length} bước cụ thể
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Người chia sẻ</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5 block">
                {issue.author || 'Chuyên gia TechCare'}
              </span>
            </div>
          </div>

          {/* Progress Tracker Bar */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-blue-900 dark:text-blue-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Tiến độ thực hiện của bạn:
              </span>
              <span className="tabular-nums font-bold">
                {completedCount}/{issue.steps.length} bước ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-blue-200/60 dark:bg-blue-900/60 overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Symptoms & Causes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Symptoms */}
            {issue.symptoms && issue.symptoms.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Dấu hiệu nhận biết
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {issue.symptoms.map((sym, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Causes */}
            {issue.causes && issue.causes.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                  Nguyên nhân phổ biến
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {issue.causes.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Required Tools */}
          {issue.requiredTools && issue.requiredTools.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Chuẩn bị:</span>
              <span>{issue.requiredTools.join(' · ')}</span>
            </div>
          )}

          {/* STEP BY STEP RESOLUTION SECTION */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Các bước xử lý chi tiết</span>
                <span className="text-xs font-normal text-slate-400">
                  (Bấm vào từng bước để đánh dấu hoàn thành)
                </span>
              </h3>

              <button
                onClick={handleCopyGuide}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Chép hướng dẫn'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {issue.steps.map((step) => {
                const isDone = !!completedSteps[step.stepNumber];
                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => toggleStep(step.stepNumber)}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer select-none ${
                      isDone
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/50'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Checkbox / Step Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStep(step.stepNumber);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4
                            className={`text-sm sm:text-base font-bold transition-colors ${
                              isDone
                                ? 'text-emerald-800 dark:text-emerald-300 line-through'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            Bước {step.stepNumber}: {step.title}
                          </h4>
                          {isDone && (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              (Đã làm)
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {step.instructions}
                        </p>

                        {/* Tip Callout */}
                        {step.tip && (
                          <div className="mt-3 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 flex items-start gap-2 text-xs text-blue-900 dark:text-blue-200">
                            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">Mẹo nhỏ: </span>
                              <span>{step.tip}</span>
                            </div>
                          </div>
                        )}

                        {/* Warning Callout */}
                        {step.warning && (
                          <div className="mt-3 p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/50 flex items-start gap-2 text-xs text-rose-900 dark:text-rose-200">
                            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">Lưu ý quan trọng: </span>
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
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Nguồn thông tin tham khảo kỹ thuật:</span>
              <a
                href={issue.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Xem bài viết gốc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-3">
          {/* Helpful vote */}
          <button
            onClick={() => onVoteHelpful(issue.id)}
            disabled={hasVotedHelpful}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all ${
              hasVotedHelpful
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasVotedHelpful ? 'fill-current' : ''}`} />
            <span>{hasVotedHelpful ? 'Đã thấy hữu ích' : 'Hữu ích'}</span>
            <span className="tabular-nums font-bold">({issue.helpfulCount + (hasVotedHelpful ? 1 : 0)})</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyGuide}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
