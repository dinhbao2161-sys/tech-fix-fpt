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
        return <Smartphone className="w-4 h-4 text-[#F97316]" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-[#FB923C]" />;
      case 'windows':
        return <Monitor className="w-4 h-4 text-[#F97316]" />;
      case 'mac':
        return <Laptop className="w-4 h-4 text-[#FB923C]" />;
      default:
        return <Cpu className="w-4 h-4 text-[#F97316]" />;
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
          color: 'text-[#F97316] bg-[#F97316]/10 border-[#F97316]/30',
        };
      case 'medium':
        return {
          label: 'Trung bình',
          color: 'text-[#FB923C] bg-[#FB923C]/10 border-[#FB923C]/30',
        };
      case 'hard':
        return {
          label: 'Chuyên sâu',
          color: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
        };
      default:
        return {
          label: 'Cơ bản',
          color: 'text-[#A0A0A0] bg-white/[0.05] border-white/[0.1]',
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
            <span className="p-2 rounded-xl bg-[#0A0A0A] border border-white/[0.08] flex items-center justify-center">
              {getPlatformIcon(issue.platform)}
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
              {getPlatformName(issue.platform)}
            </span>
            {issue.isUserSubmitted && (
              <span
                className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded flex items-center gap-1 border ${
                  issue.moderationStatus === 'rejected'
                    ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30'
                    : issue.moderationStatus === 'pending'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/25'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                {issue.moderationStatus === 'rejected'
                  ? 'Bị ẩn'
                  : issue.moderationStatus === 'pending'
                    ? 'Chờ duyệt'
                    : issue.moderatedBy === 'admin'
                      ? 'Admin duyệt'
                      : 'AI đã duyệt'}
              </span>
            )}
          </div>

          {/* Bookmark Action */}
          <button
            onClick={onToggleBookmark}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isBookmarked
                ? 'text-[#F97316] bg-[#F97316]/15 border border-[#F97316]/30'
                : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#0A0A0A]'
            }`}
            title={isBookmarked ? 'Bỏ lưu' : 'Lưu lại'}
            aria-label={isBookmarked ? 'Bỏ lưu bài viết' : 'Lưu bài viết này'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#FFFFFF] line-clamp-2 group-hover:text-[#F97316] transition-colors mb-2.5 leading-snug font-['Manrope']">
          {issue.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-[#A0A0A0] line-clamp-2 leading-relaxed mb-5 font-normal">
          {issue.summary}
        </p>

        {/* Symptoms tags preview */}
        {issue.symptoms && issue.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {issue.symptoms.slice(0, 2).map((symptom, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-[#A0A0A0] bg-[#0A0A0A] border border-white/[0.06] px-2.5 py-1 rounded-lg truncate max-w-[220px]"
              >
                • {symptom}
              </span>
            ))}
            {issue.symptoms.length > 2 && (
              <span className="text-[10px] text-[#A0A0A0]/70 font-mono py-1 px-1">
                +{issue.symptoms.length - 2} khác
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer metadata and CTA */}
      <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-[#A0A0A0]">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${severityBadge.color}`}>
            {severityBadge.label}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="tabular-nums">{issue.estimatedTime}</span>
          </span>
          <span className="hidden sm:flex items-center gap-1 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F97316]" />
            <span>{issue.steps.length} bước</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#F97316] group-hover:translate-x-1 transition-transform">
          <span>Xem cách fix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
