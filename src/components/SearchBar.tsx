import React, { useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  resultCount: number;
  totalCount: number;
}

const QUICK_SUGGESTIONS = [
  'Màn hình xanh BSOD',
  'Quên mật khẩu iPhone',
  'Check linh kiện iPhone',
  'Treo đơ Android',
  'Mất âm thanh Windows',
  'Lỗi CH Play',
  'Full Disk 100%',
  'Độ ẩm cổng sạc'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  resultCount,
  totalCount
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full space-y-4">
      {/* Dark Luxury Elevated Search Input */}
      <div className="relative group">
        <div className="luxury-search rounded-2xl flex items-center h-14 pl-5 pr-4 transition-all">
          <div className="flex items-center pointer-events-none text-[#B8C7A1] mr-3.5">
            <Search className="w-5 h-5 stroke-[1.8]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tra cứu sự cố kỹ thuật... (ví dụ: màn hình xanh, quên mật khẩu, treo máy, check pin...)"
            className="w-full bg-transparent text-sm sm:text-base text-[#F2F1EB] placeholder:text-[#A2A69D]/70 outline-none font-normal font-['Manrope']"
          />

          <div className="flex items-center gap-2.5 shrink-0 ml-2">
            {value && (
              <button
                onClick={handleClear}
                className="w-7 h-7 rounded-lg bg-[#1D211D] hover:bg-[#252a25] border border-white/[0.09] flex items-center justify-center text-[#A2A69D] hover:text-[#F2F1EB] transition-colors"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="hidden sm:flex items-center text-xs font-mono font-medium text-[#B8C7A1] px-3 py-1 rounded-lg bg-[#1D211D] border border-white/[0.09] tabular-nums">
              {resultCount} / {totalCount} sự cố
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Chips - Minimalist Tech Editorial Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[#A2A69D] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0 pl-1">
          <Sparkles className="w-3 h-3 text-[#B8C7A1]" />
          <span>Truy cập nhanh:</span>
        </span>
        {QUICK_SUGGESTIONS.map((tag) => {
          const isSelected = value.toLowerCase() === tag.toLowerCase();
          return (
            <button
              key={tag}
              onClick={() => onChange(tag)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-medium border ${
                isSelected
                  ? 'bg-[#B8C7A1]/20 border-[#B8C7A1]/60 text-[#B8C7A1] font-semibold'
                  : 'bg-[#171916] text-[#A2A69D] border-white/[0.08] hover:border-[#B8C7A1]/35 hover:text-[#F2F1EB] hover:bg-[#1D211D]'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
