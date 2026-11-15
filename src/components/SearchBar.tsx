import React, { useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  resultCount: number;
  totalCount: number;
}

const QUICK_SUGGESTIONS = [
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
      {/* Dark Minimalist Elevated Search Input */}
      <div className="relative group">
        <div className="luxury-search rounded-2xl flex items-center h-14 pl-5 pr-4 transition-all">
          <div className="flex items-center pointer-events-none text-[#F97316] mr-3.5">
            <Search className="w-5 h-5 stroke-[2]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Hỏi hoặc tra cứu sự cố thiết bị... (ví dụ: màn hình xanh, quên mật khẩu, máy đơ, pin ảo...)"
            className="w-full bg-transparent text-sm sm:text-base text-[#FFFFFF] placeholder:text-[#A0A0A0]/60 outline-none font-normal font-['Manrope']"
          />

          <div className="flex items-center gap-2.5 shrink-0 ml-2">
            {value && (
              <button
                onClick={handleClear}
                className="w-7 h-7 rounded-lg bg-[#121212] hover:bg-[#1E1E1E] border border-white/[0.08] flex items-center justify-center text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="hidden sm:flex items-center text-xs font-mono font-medium text-[#F97316] px-3 py-1 rounded-lg bg-[#121212] border border-white/[0.08] tabular-nums">
              {resultCount} / {totalCount} sự cố
            </div>
          </div>
        </div>
      </div>

      {/* Conversational Quick Search Chips - Black & Orange */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[#A0A0A0] font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0 pl-1">
          <Sparkles className="w-3 h-3 text-[#F97316]" />
          <span>Gợi ý nhanh:</span>
        </span>
        {QUICK_SUGGESTIONS.map((tag) => {
          const isSelected = value.toLowerCase() === tag.toLowerCase();
          return (
            <button
              key={tag}
              onClick={() => onChange(tag)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all text-xs font-medium border cursor-pointer ${
                isSelected
                  ? 'bg-[#F97316]/20 border-[#F97316]/70 text-[#F97316] font-semibold'
                  : 'bg-[#0A0A0A] text-[#A0A0A0] border-white/[0.08] hover:border-[#F97316]/40 hover:text-[#FFFFFF] hover:bg-[#121212]'
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
