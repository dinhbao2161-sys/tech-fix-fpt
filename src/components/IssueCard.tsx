import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  ArrowRight, 
  Smartphone, 
  Monitor, 
  Laptop, 
  Cpu, 
  Sparkles,
  ThumbsUp,
  User
} from 'lucide-react';
import { Issue } from '../types/issue';

interface IssueCardProps {
  issue: Issue;
  onClick: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onClick,
  isBookmarked,
  onToggleBookmark,
}) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'iphone':
        return <Smartphone className="w-4 h-4 text-slate-800 dark:text-slate-200" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'windows':
        return <Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'mac':
        return <Laptop className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'iphone':
        return 'iPhone / iOS';
      case 'android':
        return 'Android';
      case 'windows':
        return 'Windows';
      case 'mac':
        return 'macOS';
      default:
        return 'Phần cứng';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'easy':
        return {
          label: 'Dễ xử lý',
          color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
        };
      case 'medium':
        return {
          label: 'Vừa phải',
          color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
        };
      case 'hard':
        return {
          label: 'Nâng cao',
          color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40',
        };
      default:
        return {
          label: 'Cơ bản',
          color: 'text-slate-700 bg-slate-50 border-slate-200',
        };
    }
  };

  const severityBadge = getSeverityBadge(issue.severity);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="ios-glass ios-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-blue-400/50 dark:hover:border-blue-500/40 cursor-pointer flex flex-col justify-between group transition-all text-left"
    >
      <div>
        {/* Top Header metadata */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              {getPlatformIcon(issue.platform)}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {getPlatformName(issue.platform)}
            </span>
            {issue.isUserSubmitted && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 flex items-center gap-1 border border-violet-200 dark:border-violet-800/50">
                <Sparkles className="w-2.5 h-2.5" />
                Người dùng đóng góp
              </span>
            )}
          </div>

          {/* Bookmark Action */}
          <button
            onClick={onToggleBookmark}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100'
                : 'text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Bỏ lưu' : 'Lưu lại'}
            aria-label={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết này'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
          {issue.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {issue.summary}
        </p>

        {/* Symptoms tags preview */}
        {issue.symptoms && issue.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {issue.symptoms.slice(0, 2).map((symptom, idx) => (
              <span
                key={idx}
                className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-md truncate max-w-[200px]"
              >
                • {symptom}
              </span>
            ))}
            {issue.symptoms.length > 2 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 py-0.5">
                +{issue.symptoms.length - 2} dấu hiệu khác
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer metadata and CTA */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${severityBadge.color}`}>
            {severityBadge.label}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums">{issue.estimatedTime}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
            <span>{issue.steps.length} bước</span>
          </span>
        </div>

        <div className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <span>Xem cách fix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
