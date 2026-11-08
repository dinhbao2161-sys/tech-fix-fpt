import React from 'react';
import { Wrench, Plus, Sun, Moon, Bookmark, Sparkles } from 'lucide-react';
import { Platform } from '../types/issue';

interface HeaderProps {
  currentPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  onOpenAddModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  bookmarkCount: number;
  showOnlyBookmarks: boolean;
  onToggleBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlatform,
  onSelectPlatform,
  onOpenAddModal,
  isDarkMode,
  onToggleDarkMode,
  bookmarkCount,
  showOnlyBookmarks,
  onToggleBookmarks,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full ios-glass border-b border-black/5 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            onSelectPlatform('all');
            if (showOnlyBookmarks) onToggleBookmarks();
          }}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-shadow">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                TechCare
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                iOS Style
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Cẩm nang xử lý sự cố thiết bị
            </p>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line, clean text links) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectPlatform('all')}
            className={`transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              currentPlatform === 'all' && !showOnlyBookmarks
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            Tất cả thiết bị
          </button>
          <button
            onClick={() => onSelectPlatform('iphone')}
            className={`transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              currentPlatform === 'iphone'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            iPhone & iOS
          </button>
          <button
            onClick={() => onSelectPlatform('android')}
            className={`transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              currentPlatform === 'android'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            Android
          </button>
          <button
            onClick={() => onSelectPlatform('windows')}
            className={`transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              currentPlatform === 'windows'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            Windows PC
          </button>
          <button
            onClick={() => onSelectPlatform('mac')}
            className={`transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              currentPlatform === 'mac'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            MacBook
          </button>
        </nav>

        {/* Zone 3: Actions (Bookmarks, Theme toggle, Primary CTA button) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Bookmark Toggle */}
          <button
            onClick={onToggleBookmarks}
            className={`h-9 px-2.5 sm:px-3 rounded-xl flex items-center gap-1.5 text-xs font-medium transition-all ${
              showOnlyBookmarks
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Đã lưu yêu thích"
            aria-label="Danh sách đã lưu"
          >
            <Bookmark className={`w-4 h-4 ${showOnlyBookmarks ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Đã lưu</span>
            {bookmarkCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                  showOnlyBookmarks
                    ? 'bg-white text-amber-600'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                }`}
              >
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label={isDarkMode ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenAddModal}
            className="h-9 px-3 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm lỗi & Cách fix</span>
          </button>
        </div>
      </div>
    </header>
  );
};
