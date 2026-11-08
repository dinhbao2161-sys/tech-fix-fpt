import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  BatteryCharging, 
  Wifi, 
  Gauge
} from 'lucide-react';
import { Platform, Category, Severity } from '../types/issue';

interface SegmentedControlProps {
  platform: Platform;
  onChangePlatform: (p: Platform) => void;
  category: Category;
  onChangeCategory: (c: Category) => void;
  severity: 'all' | Severity;
  onChangeSeverity: (s: 'all' | Severity) => void;
  platformCounts: Record<Platform, number>;
}

const PLATFORMS: { id: Platform; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Tất cả thiết bị', icon: <Layers className="w-4 h-4" /> },
  { id: 'iphone', label: 'iPhone / iOS', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'android', label: 'Android', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'windows', label: 'Windows PC', icon: <Monitor className="w-4 h-4" /> },
  { id: 'mac', label: 'MacBook', icon: <Laptop className="w-4 h-4" /> },
  { id: 'hardware', label: 'Linh kiện', icon: <Cpu className="w-4 h-4" /> },
];

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Tất cả danh mục', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'system', label: 'Hệ thống & Khởi động', icon: <Gauge className="w-3.5 h-3.5" /> },
  { id: 'screen', label: 'Màn hình & Cảm ứng', icon: <Monitor className="w-3.5 h-3.5" /> },
  { id: 'battery', label: 'Pin & Sạc nguồn', icon: <BatteryCharging className="w-3.5 h-3.5" /> },
  { id: 'network', label: 'Mạng, Wi-Fi & SIM', icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: 'security', label: 'Mật khẩu & Khóa máy', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  { id: 'hardware', label: 'Phần cứng & Bo mạch', icon: <Cpu className="w-3.5 h-3.5" /> },
];

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  platform,
  onChangePlatform,
  category,
  onChangeCategory,
  severity,
  onChangeSeverity,
  platformCounts,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* 1. iOS Primary Platform Segmented Switch */}
      <div className="p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-md flex items-center overflow-x-auto no-scrollbar gap-1 border border-slate-300/40 dark:border-slate-700/40 shadow-inner">
        {PLATFORMS.map((item) => {
          const isActive = platform === item.id;
          const count = platformCounts[item.id] || 0;
          return (
            <button
              key={item.id}
              onClick={() => onChangePlatform(item.id)}
              className={`flex-1 min-w-[130px] sm:min-w-0 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-semibold ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-300/50 dark:bg-slate-700/50 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-filters: Categories and Severity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Categories Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isCatActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChangeCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                  isCatActive
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'bg-transparent border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Complexity/Severity Filter */}
        <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto text-xs">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Độ phức tạp:</span>
          {(['all', 'easy', 'medium', 'hard'] as const).map((sev) => {
            const isSevActive = severity === sev;
            const labelMap = {
              all: 'Mọi mức',
              easy: 'Dễ sửa',
              medium: 'Vừa phải',
              hard: 'Nâng cao'
            };
            return (
              <button
                key={sev}
                onClick={() => onChangeSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  isSevActive
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {labelMap[sev]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
