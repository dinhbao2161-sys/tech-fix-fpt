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
    <div className="w-full space-y-3">
      {/* iOS search input capsule */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tìm kiếm lỗi thiết bị... (ví dụ: màn hình xanh, quên mật khẩu, treo máy, check pin...)"
          className="w-full h-12 pl-11 pr-24 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all outline-none shadow-sm backdrop-blur-md"
        />

        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
          {value && (
            <button
              onClick={handleClear}
              className="w-7 h-7 rounded-full bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Xóa nội dung tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden sm:flex items-center text-[11px] font-medium text-slate-400 dark:text-slate-500 px-2 py-1 rounded-md bg-slate-100/80 dark:bg-slate-800/80 tabular-nums">
            {resultCount}/{totalCount} mục
          </div>
        </div>
      </div>

      {/* Quick Search Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 pl-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Gợi ý:</span>
        </span>
        {QUICK_SUGGESTIONS.map((tag) => (
          <button
            key={tag}
            onClick={() => onChange(tag)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-all border ${
              value.toLowerCase() === tag.toLowerCase()
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white/60 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-200 dark:hover:border-blue-800'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
