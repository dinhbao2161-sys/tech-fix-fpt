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
      {/* 1. Primary Platform Segmented Bar (Dark Minimalist Black & Orange) */}
      <div className="p-1.5 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] shadow-md flex items-center overflow-x-auto no-scrollbar gap-1.5">
        {PLATFORMS.map((item) => {
          const isActive = platform === item.id;
          const count = platformCounts[item.id] || 0;
          return (
            <button
              key={item.id}
              onClick={() => onChangePlatform(item.id)}
              className={`flex-1 min-w-[130px] sm:min-w-0 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 transition-all whitespace-nowrap border cursor-pointer ${
                isActive
                  ? 'bg-[#121212] text-[#FFFFFF] font-bold border-[#F97316]/50 shadow-[0_2px_12px_rgba(249,115,22,0.12)]'
                  : 'text-[#A0A0A0] hover:text-[#FFFFFF] hover:bg-[#121212]/60 border-transparent'
              }`}
            >
              <span className={isActive ? 'text-[#F97316]' : 'text-[#A0A0A0]'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold tabular-nums ${
                  isActive
                    ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/35'
                    : 'bg-[#000000] text-[#A0A0A0] border border-white/[0.05]'
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-all border cursor-pointer ${
                  isCatActive
                    ? 'bg-[#F97316]/15 border-[#F97316]/45 text-[#F97316] font-semibold'
                    : 'bg-[#0A0A0A] text-[#A0A0A0] border-white/[0.08] hover:border-white/[0.18] hover:text-[#FFFFFF] hover:bg-[#121212]'
                }`}
              >
                <span className={isCatActive ? 'text-[#F97316]' : 'text-[#A0A0A0]'}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Complexity/Severity Filter */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto text-xs bg-[#0A0A0A] p-1 rounded-xl border border-white/[0.08]">
          <span className="text-[#A0A0A0] font-mono text-[10px] uppercase tracking-wider px-2 hidden md:inline">
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
                className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium border cursor-pointer ${
                  isSevActive
                    ? 'bg-[#121212] text-[#F97316] border-[#F97316]/40 font-semibold'
                    : 'text-[#A0A0A0] border-transparent hover:text-[#FFFFFF]'
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
