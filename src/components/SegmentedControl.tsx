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
  { id: 'android', label: 'Android OS', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'windows', label: 'Windows PC', icon: <Monitor className="w-4 h-4" /> },
  { id: 'mac', label: 'macOS', icon: <Laptop className="w-4 h-4" /> },
  { id: 'hardware', label: 'Linh kiện', icon: <Cpu className="w-4 h-4" /> },
];

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Toàn bộ danh mục', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'system', label: 'Hệ thống & Khởi động', icon: <Gauge className="w-3.5 h-3.5" /> },
  { id: 'screen', label: 'Màn hình & Cảm ứng', icon: <Monitor className="w-3.5 h-3.5" /> },
  { id: 'battery', label: 'Nguồn & Tế bào pin', icon: <BatteryCharging className="w-3.5 h-3.5" /> },
  { id: 'network', label: 'Mạng viễn thông & Wi-Fi', icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: 'security', label: 'Khóa bảo mật & Mật khẩu', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  { id: 'hardware', label: 'Bo mạch & Chipset', icon: <Cpu className="w-3.5 h-3.5" /> },
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
      {/* 1. Primary Platform Segmented Bar (Dark Luxury Surface) */}
      <div className="p-1.5 rounded-2xl bg-[#171916] border border-white/[0.09] shadow-md flex items-center overflow-x-auto no-scrollbar gap-1.5">
        {PLATFORMS.map((item) => {
          const isActive = platform === item.id;
          const count = platformCounts[item.id] || 0;
          return (
            <button
              key={item.id}
              onClick={() => onChangePlatform(item.id)}
              className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-[#1D211D] text-[#F2F1EB] font-bold border-[#B8C7A1]/40 shadow-sm'
                  : 'text-[#A2A69D] hover:text-[#F2F1EB] hover:bg-[#1D211D]/60 border-transparent'
              }`}
            >
              <span className={isActive ? 'text-[#B8C7A1]' : 'text-[#A2A69D]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold tabular-nums ${
                  isActive
                    ? 'bg-[#B8C7A1]/20 text-[#B8C7A1] border border-[#B8C7A1]/30'
                    : 'bg-[#10110F] text-[#A2A69D] border border-white/[0.05]'
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
        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isCatActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChangeCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                  isCatActive
                    ? 'bg-[#B8C7A1]/15 border-[#B8C7A1]/40 text-[#B8C7A1] font-semibold'
                    : 'bg-[#171916] text-[#A2A69D] border-white/[0.08] hover:border-white/[0.18] hover:text-[#F2F1EB] hover:bg-[#1D211D]'
                }`}
              >
                <span className={isCatActive ? 'text-[#B8C7A1]' : 'text-[#A2A69D]'}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Complexity/Severity Filter */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto text-xs bg-[#171916] p-1 rounded-xl border border-white/[0.08]">
          <span className="text-[#A2A69D] font-mono text-[10px] uppercase tracking-wider px-2 hidden md:inline">
            Độ khó:
          </span>
          {(['all', 'easy', 'medium', 'hard'] as const).map((sev) => {
            const isSevActive = severity === sev;
            const labelMap = {
              all: 'Tất cả',
              easy: 'Dễ',
              medium: 'Trung bình',
              hard: 'Nâng cao'
            };
            return (
              <button
                key={sev}
                onClick={() => onChangeSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium border ${
                  isSevActive
                    ? 'bg-[#1D211D] text-[#B8C7A1] border-[#B8C7A1]/40 font-semibold'
                    : 'text-[#A2A69D] border-transparent hover:text-[#F2F1EB]'
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
