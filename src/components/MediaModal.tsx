import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 flex items-center justify-between text-white/90 z-20">
          <span className="text-xs font-mono uppercase tracking-wider text-white/60">
            AURA Studio Pro — Product Reveal Film
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Canvas / Simulator */}
        <div className="relative aspect-[16/9] w-full bg-neutral-900 overflow-hidden flex items-center justify-center">
          <img
            src="/src/assets/images/hero_flagship_device_1794494052841.jpg"
            alt="Film Frame"
            className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-105 opacity-90' : 'scale-100 opacity-60'}`}
          />

          {/* Central Overlay Indicator */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          {/* Bottom Video Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between text-white text-xs z-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-white/80 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-white/80 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="font-mono text-[11px] text-white/70">
                01:14 / 01:45 · 4K HDR Dolby Vision
              </span>
            </div>

            <div className="text-[11px] font-mono text-white/60 hidden sm:block">
              Chapter: Precision Titanium Milling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
