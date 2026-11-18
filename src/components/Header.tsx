import React from 'react';
import {
  Wrench,
  Plus,
  Bookmark,
  Camera,
} from 'lucide-react';
import { Platform } from '../types/issue';

interface HeaderProps {
  currentPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
  bookmarkCount: number;
  showOnlyBookmarks: boolean;
  onToggleBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlatform,
  onSelectPlatform,
  onOpenAddModal,
  onOpenScanner,
  bookmarkCount,
  showOnlyBookmarks,
  onToggleBookmarks,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000] border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            onSelectPlatform('all');
            if (showOnlyBookmarks) onToggleBookmarks();
          }}
          className="flex items-center gap-2 sm:gap-3 text-left group transition-opacity hover:opacity-95 cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#0E0E0E] border border-[#F97316]/30 flex items-center justify-center text-[#F97316] group-hover:border-[#F97316]/70 transition-colors shadow-[0_2px_10px_rgba(249,115,22,0.15)]">
            <Wrench className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-xl font-bold tracking-tight text-[#FFFFFF] font-['Manrope']">
                TechCare
              </span>
            </div>
            <p className="text-[11px] text-[#A0A0A0] hidden xl:block tracking-wide font-normal">
              Cẩm nang xử lý sự cố thiết bị
            </p>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[11px] xl:text-xs uppercase tracking-wider font-semibold text-[#A0A0A0]">
          <button
            onClick={() => onSelectPlatform('all')}
            className={`py-2 relative transition-colors whitespace-nowrap hover:text-[#FFFFFF] cursor-pointer ${
              currentPlatform === 'all' && !showOnlyBookmarks ? 'text-[#F97316]' : ''
            }`}
          >
            Tất cả thiết bị
            {currentPlatform === 'all' && !showOnlyBookmarks && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F97316] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onSelectPlatform('iphone')}
            className={`py-2 relative transition-colors whitespace-nowrap hover:text-[#FFFFFF] cursor-pointer ${
              currentPlatform === 'iphone' ? 'text-[#F97316]' : ''
            }`}
          >
            iPhone & iOS
            {currentPlatform === 'iphone' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F97316] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onSelectPlatform('android')}
            className={`py-2 relative transition-colors whitespace-nowrap hover:text-[#FFFFFF] cursor-pointer ${
              currentPlatform === 'android' ? 'text-[#F97316]' : ''
            }`}
          >
            Android
            {currentPlatform === 'android' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F97316] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onSelectPlatform('windows')}
            className={`py-2 relative transition-colors whitespace-nowrap hover:text-[#FFFFFF] cursor-pointer ${
              currentPlatform === 'windows' ? 'text-[#F97316]' : ''
            }`}
          >
            Windows PC
            {currentPlatform === 'windows' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F97316] rounded-full" />
            )}
          </button>
          <button
            onClick={() => onSelectPlatform('mac')}
            className={`py-2 relative transition-colors whitespace-nowrap hover:text-[#FFFFFF] cursor-pointer ${
              currentPlatform === 'mac' ? 'text-[#F97316]' : ''
            }`}
          >
            macOS
            {currentPlatform === 'mac' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F97316] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Bookmarks + Quét lỗi AI + Đóng góp giải pháp */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Saved Articles Toggle */}
          <button
            onClick={onToggleBookmarks}
            className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium transition-all border cursor-pointer ${
              showOnlyBookmarks
                ? 'bg-[#F97316]/15 text-[#F97316] border-[#F97316]/40'
                : 'bg-[#0E0E0E] text-[#A0A0A0] border-white/[0.08] hover:text-[#FFFFFF] hover:border-white/[0.2]'
            }`}
            title="Mục đã lưu"
            aria-label="Danh sách mục đã lưu"
          >
            <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarks ? 'fill-current text-[#F97316]' : ''}`} />
            <span className="hidden md:inline">Đã lưu</span>
            {bookmarkCount > 0 && (
              <span className="text-[10px] px-1 rounded font-mono font-bold bg-[#F97316]/20 text-[#F97316]">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Gemini Camera Error Scanner Button */}
          <button
            onClick={onOpenScanner}
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-[#0E0E0E] hover:bg-[#161616] text-[#F97316] border border-[#F97316]/40 hover:border-[#F97316]/80 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            title="Nhận diện lỗi bằng Camera Gemini"
          >
            <Camera className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
            <span className="hidden sm:inline">Quét lỗi AI</span>
            <span className="sm:hidden">Quét AI</span>
          </button>

          {/* Orange Add Issue CTA Button */}
          <button
            onClick={onOpenAddModal}
            className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-[#F97316] hover:bg-[#FB923C] active:scale-[0.98] text-[#000000] text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_2px_14px_rgba(249,115,22,0.3)] tracking-wide cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
            <span className="hidden sm:inline">Đóng góp giải pháp</span>
            <span className="sm:hidden">Đóng góp</span>
          </button>
        </div>
      </div>
    </header>
  );
};
