import React from 'react';
import {
  Wrench,
  Plus,
  Bookmark,
  Camera,
  LogIn,
  LogOut,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { Platform } from '../types/issue';
import { AuthUser } from '../types/auth';

interface HeaderProps {
  currentPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
  bookmarkCount: number;
  showOnlyBookmarks: boolean;
  onToggleBookmarks: () => void;
  currentUser: AuthUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenAdminModal: () => void;
  pendingModerationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlatform,
  onSelectPlatform,
  onOpenAddModal,
  onOpenScanner,
  bookmarkCount,
  showOnlyBookmarks,
  onToggleBookmarks,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenAdminModal,
  pendingModerationCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#000000] border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-1 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            onSelectPlatform('all');
            if (showOnlyBookmarks) onToggleBookmarks();
          }}
          className="flex items-center gap-1.5 sm:gap-3 text-left group transition-opacity hover:opacity-95 cursor-pointer shrink-0"
        >
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0E0E0E] border border-[#F97316]/30 flex items-center justify-center text-[#F97316] group-hover:border-[#F97316]/70 transition-colors shadow-[0_2px_10px_rgba(249,115,22,0.15)]">
            <Wrench className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-xl font-bold tracking-tight text-[#FFFFFF] font-['Manrope']">
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

        {/* Zone 3: Bookmarks + Quét lỗi AI + Đóng góp giải pháp + Đăng nhập / Admin */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Saved Articles Toggle */}
          <button
            onClick={onToggleBookmarks}
            className={`relative h-8 sm:h-9 w-7 sm:w-auto sm:px-2.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium transition-all border cursor-pointer ${
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
              <>
                <span className="sm:hidden absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F97316]" />
                <span className="hidden sm:inline text-[10px] px-1 rounded font-mono font-bold bg-[#F97316]/20 text-[#F97316]">
                  {bookmarkCount}
                </span>
              </>
            )}
          </button>

          {/* Gemini Camera Error Scanner Button */}
          <button
            onClick={onOpenScanner}
            className="h-8 sm:h-9 px-1.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#0E0E0E] hover:bg-[#161616] text-[#F97316] border border-[#F97316]/40 hover:border-[#F97316]/80 text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            title="Nhận diện lỗi bằng Camera Gemini"
          >
            <Camera className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
            <span className="hidden sm:inline">Quét lỗi AI</span>
            <span className="sm:hidden">Quét AI</span>
          </button>

          {/* Orange Add Issue CTA Button */}
          <button
            onClick={onOpenAddModal}
            className="h-8 sm:h-9 px-1.5 sm:px-3.5 rounded-lg sm:rounded-xl bg-[#F97316] hover:bg-[#FB923C] active:scale-[0.98] text-[#000000] text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all shadow-[0_2px_14px_rgba(249,115,22,0.3)] tracking-wide cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] shrink-0" />
            <span className="hidden sm:inline">Đóng góp giải pháp</span>
            <span className="sm:hidden">Thêm</span>
          </button>

          {/* Auth / Account / Admin Controls right beside Quét lỗi AI & Đóng góp giải pháp */}
          {!currentUser ? (
            <button
              onClick={onOpenAuthModal}
              className="h-8 sm:h-9 px-2 sm:px-3.5 rounded-lg sm:rounded-xl bg-[#121212] hover:bg-[#1A1A1A] text-[#FFFFFF] border border-white/[0.15] hover:border-[#F97316]/60 text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              title="Đăng nhập tài khoản hoặc Admin"
            >
              <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F97316] shrink-0" />
              <span>Đăng nhập</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5">
              {currentUser.role === 'admin' && (
                <button
                  onClick={onOpenAdminModal}
                  className="h-8 sm:h-9 px-1.5 sm:px-3 rounded-lg sm:rounded-xl bg-[#F97316]/15 hover:bg-[#F97316]/25 text-[#F97316] border border-[#F97316]/40 text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                  title="Quản trị & Duyệt bài đóng góp"
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="sm:hidden">Admin</span>
                  <span className="hidden sm:inline">Quản trị</span>
                  {pendingModerationCount > 0 && (
                    <span className="text-[10px] px-1 sm:px-1.5 rounded-full bg-[#F97316] text-[#000000] font-mono font-bold">
                      {pendingModerationCount}
                    </span>
                  )}
                </button>
              )}

              <div
                className={`h-8 sm:h-9 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl bg-[#0E0E0E] border border-white/[0.1] items-center gap-1.5 text-xs ${
                  currentUser.role === 'admin' ? 'hidden sm:flex' : 'flex'
                }`}
                title={`${currentUser.name} (${currentUser.email})`}
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-[#F97316]" />
                )}
                <span className="hidden md:inline text-[#FFFFFF] font-medium max-w-[96px] truncate">
                  {currentUser.name}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="hidden sm:inline text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#F97316] text-[#000000]">
                    ADMIN
                  </span>
                )}
              </div>

              <button
                onClick={onLogout}
                className="h-8 sm:h-9 w-7 sm:w-9 rounded-lg sm:rounded-xl bg-[#0E0E0E] hover:bg-[#1A1A1A] border border-white/[0.1] hover:border-[#EF4444]/50 text-[#A0A0A0] hover:text-[#EF4444] flex items-center justify-center transition-colors cursor-pointer"
                title="Đăng xuất"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
