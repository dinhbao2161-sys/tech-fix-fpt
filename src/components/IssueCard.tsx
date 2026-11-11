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
  Sparkles
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
        return <Smartphone className="w-4 h-4 text-[#B8C7A1]" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-[#A6B39B]" />;
      case 'windows':
        return <Monitor className="w-4 h-4 text-[#B8C7A1]" />;
      case 'mac':
        return <Laptop className="w-4 h-4 text-[#A6B39B]" />;
      default:
        return <Cpu className="w-4 h-4 text-[#B8C7A1]" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'iphone':
        return 'Apple iOS';
      case 'android':
        return 'Android OS';
      case 'windows':
        return 'Windows OS';
      case 'mac':
        return 'Apple macOS';
      default:
        return 'Phần cứng';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'easy':
        return {
          label: 'Dễ xử lý',
          color: 'text-[#B8C7A1] bg-[#B8C7A1]/10 border-[#B8C7A1]/30',
        };
      case 'medium':
        return {
          label: 'Trung bình',
          color: 'text-[#E0C097] bg-[#E0C097]/10 border-[#E0C097]/30',
        };
      case 'hard':
        return {
          label: 'Chuyên sâu',
          color: 'text-[#E07A5F] bg-[#E07A5F]/10 border-[#E07A5F]/30',
        };
      default:
        return {
          label: 'Cơ bản',
          color: 'text-[#A2A69D] bg-white/[0.05] border-white/[0.1]',
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
      className="luxury-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between group text-left relative"
    >
      <div>
        {/* Top Header metadata */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#171916] border border-white/[0.09] flex items-center justify-center">
              {getPlatformIcon(issue.platform)}
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#A2A69D]">
              {getPlatformName(issue.platform)}
            </span>
            {issue.isUserSubmitted && (
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[#B8C7A1]/10 text-[#B8C7A1] flex items-center gap-1 border border-[#B8C7A1]/20">
                <Sparkles className="w-2.5 h-2.5 text-[#B8C7A1]" />
                Đóng góp
              </span>
            )}
          </div>

          {/* Bookmark Action */}
          <button
            onClick={onToggleBookmark}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isBookmarked
                ? 'text-[#B8C7A1] bg-[#B8C7A1]/15 border border-[#B8C7A1]/30'
                : 'text-[#A2A69D] hover:text-[#F2F1EB] hover:bg-[#171916]'
            }`}
            title={isBookmarked ? 'Bỏ lưu' : 'Lưu lại'}
            aria-label={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết này'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#F2F1EB] line-clamp-2 group-hover:text-[#B8C7A1] transition-colors mb-2.5 leading-snug font-['Manrope']">
          {issue.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-[#A2A69D] line-clamp-2 leading-relaxed mb-5 font-normal">
          {issue.summary}
        </p>

        {/* Symptoms tags preview */}
        {issue.symptoms && issue.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {issue.symptoms.slice(0, 2).map((symptom, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-[#A2A69D] bg-[#171916] border border-white/[0.06] px-2.5 py-1 rounded-lg truncate max-w-[220px]"
              >
                • {symptom}
              </span>
            ))}
            {issue.symptoms.length > 2 && (
              <span className="text-[10px] text-[#A2A69D]/70 font-mono py-1 px-1">
                +{issue.symptoms.length - 2} khác
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer metadata and CTA */}
      <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-[#A2A69D]">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${severityBadge.color}`}>
            {severityBadge.label}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#B8C7A1]" />
            <span className="tabular-nums">{issue.estimatedTime}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B8C7A1]" />
            <span>{issue.steps.length} bước</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#B8C7A1] group-hover:translate-x-1 transition-transform">
          <span>Xem cách fix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
