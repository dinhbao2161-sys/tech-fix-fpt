import React from 'react';
import { Terminal, Plus, Bookmark, Compass } from 'lucide-react';
import { Platform } from '../types/issue';

interface HeaderProps {
  currentPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  onOpenAddModal: () => void;
  bookmarkCount: number;
  showOnlyBookmarks: boolean;
  onToggleBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlatform,
  onSelectPlatform,
  onOpenAddModal,
  bookmarkCount,
  showOnlyBookmarks,
  onToggleBookmarks,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#10110F]/95 border-b border-white/[0.09] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Dark Luxury Tech Editorial) */}
        <button
          onClick={() => {
            onSelectPlatform('all');
            if (showOnlyBookmarks) onToggleBookmarks();
          }}
          className="flex items-center gap-3 text-left group transition-opacity hover:opacity-90"
        >
          <div className="w-10 h-10 rounded-xl bg-[#171916] border border-white/[0.12] flex items-center justify-center text-[#B8C7A1] group-hover:border-[#B8C7A1]/40 transition-colors shadow-inner">
            <Terminal className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-[#F2F1EB] font-['Manrope']">
                TechCare
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-[#B8C7A1] px-1.5 py-0.5 rounded bg-[#B8C7A1]/10 border border-[#B8C7A1]/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#A2A69D] hidden sm:block tracking-wide">
              Hệ thống chẩn đoán & cẩm nang kỹ thuật
            </p>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean Editorial Line) */}
        <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-semibold text-[#A2A69D]">
          <button
            onClick={() => onSelectPlatform('all')}
            className={`py-1.5 relative transition-colors whitespace-nowrap hover:text-[#F2F1EB] ${
              currentPlatform === 'all' && !showOnlyBookmarks
                ? 'text-[#B8C7A1]'
                : ''
            }`}
          >
            Tất cả thiết bị
            {currentPlatform === 'all' && !showOnlyBookmarks && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8C7A1] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onSelectPlatform('iphone')}
            className={`py-1.5 relative transition-colors whitespace-nowrap hover:text-[#F2F1EB] ${
              currentPlatform === 'iphone'
                ? 'text-[#B8C7A1]'
                : ''
            }`}
          >
            iPhone & iOS
            {currentPlatform === 'iphone' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8C7A1] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onSelectPlatform('android')}
            className={`py-1.5 relative transition-colors whitespace-nowrap hover:text-[#F2F1EB] ${
              currentPlatform === 'android'
                ? 'text-[#B8C7A1]'
                : ''
            }`}
          >
            Android
            {currentPlatform === 'android' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8C7A1] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onSelectPlatform('windows')}
            className={`py-1.5 relative transition-colors whitespace-nowrap hover:text-[#F2F1EB] ${
              currentPlatform === 'windows'
                ? 'text-[#B8C7A1]'
                : ''
            }`}
          >
            Windows PC
            {currentPlatform === 'windows' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8C7A1] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onSelectPlatform('mac')}
            className={`py-1.5 relative transition-colors whitespace-nowrap hover:text-[#F2F1EB] ${
              currentPlatform === 'mac'
                ? 'text-[#B8C7A1]'
                : ''
            }`}
          >
            macOS
            {currentPlatform === 'mac' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8C7A1] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions (Saved articles + Luxury CTA Button) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Saved Articles Toggle */}
          <button
            onClick={onToggleBookmarks}
            className={`h-9 px-3 rounded-xl flex items-center gap-2 text-xs font-medium transition-all border ${
              showOnlyBookmarks
                ? 'bg-[#B8C7A1]/15 text-[#B8C7A1] border-[#B8C7A1]/40'
                : 'bg-[#171916] text-[#A2A69D] border-white/[0.09] hover:text-[#F2F1EB] hover:border-white/[0.18]'
            }`}
            title="Mục đã lưu trữ"
            aria-label="Danh sách mục đã lưu"
          >
            <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-current text-[#B8C7A1]' : ''}`} />
            <span className="hidden sm:inline">Đã lưu</span>
            {bookmarkCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#B8C7A1]/20 text-[#B8C7A1]">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Luxury CTA Button */}
          <button
            onClick={onOpenAddModal}
            className="h-9 px-4 rounded-xl bg-[#B8C7A1] hover:bg-[#c7d5b1] active:scale-[0.98] text-[#10110F] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm tracking-wide"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Đóng góp giải pháp</span>
            <span className="sm:hidden">Thêm</span>
          </button>
        </div>
      </div>
    </header>
  );
};
