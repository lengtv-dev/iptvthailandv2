import React, { useState, useEffect } from 'react';
import { 
  Tv, Volume2, VolumeX, ChevronUp, ChevronDown, 
  RotateCcw, Info, Maximize2, ShieldCheck, 
  Search, X, Hash, CornerDownLeft
} from 'lucide-react';
import { ViewMode } from '../types';

interface TVRemoteProps {
  onSelectChannelNumber: (num: string) => void;
  onPrevChannel: () => void;
  onNextChannel: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onToggleFullscreen: () => void;
  onOpenSchedule: () => void;
  useProxy: boolean;
  onToggleProxy: () => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TVRemote: React.FC<TVRemoteProps> = ({
  onSelectChannelNumber,
  onPrevChannel,
  onNextChannel,
  onToggleMute,
  isMuted,
  onToggleFullscreen,
  onOpenSchedule,
  useProxy,
  onToggleProxy,
  viewMode,
  onToggleViewMode,
  isOpen,
  onClose
}) => {
  const [inputDigits, setInputDigits] = useState<string>('');

  const handleDigit = (digit: string) => {
    const updated = (inputDigits + digit).slice(0, 4);
    setInputDigits(updated);
  };

  const handleConfirm = () => {
    if (inputDigits) {
      onSelectChannelNumber(inputDigits);
      setInputDigits('');
    }
  };

  const handleClear = () => {
    setInputDigits('');
  };

  // Auto-submit after 1.8s of no typing
  useEffect(() => {
    if (!inputDigits) return;
    const timer = setTimeout(() => {
      handleConfirm();
    }, 1800);
    return () => clearTimeout(timer);
  }, [inputDigits]);

  if (!isOpen) return null;

  const isTvLarge = viewMode === 'tv';

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-88 bg-neutral-900/95 backdrop-blur-xl border-l border-neutral-800 shadow-2xl z-50 flex flex-col p-4 text-white animate-slideLeft">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <Tv className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">รีโมททีวี (Fire TV / Smart TV)</h3>
            <p className="text-[11px] text-neutral-400">ควบคุมด้วยปุ่มลัดหรือหน้าจอสัมผัส</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Channel Number Screen Display */}
      <div className="mt-4 p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
        <span className="text-xs text-neutral-400">กดเลขช่อง:</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-mono font-bold text-red-500 tracking-wider">
            {inputDigits ? `CH ${inputDigits}` : 'CH --'}
          </span>
          {inputDigits && (
            <button
              onClick={handleConfirm}
              className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold cursor-pointer"
            >
              OK
            </button>
          )}
        </div>
      </div>

      {/* Navigation D-Pad & Channel Changer */}
      <div className="mt-4 flex flex-col items-center">
        <div className="text-xs text-neutral-400 mb-2 font-medium">สลับช่อง (CH+ / CH-)</div>
        <div className="flex items-center gap-4">
          <button
            onClick={onPrevChannel}
            className={`rounded-2xl bg-neutral-800 hover:bg-red-600 active:scale-95 text-white flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-lg ${
              isTvLarge ? 'w-20 h-16' : 'w-16 h-14'
            }`}
            title="ช่องก่อนหน้า"
          >
            <ChevronUp className="w-6 h-6" />
            <span className="text-[10px] font-bold">CH -</span>
          </button>

          <button
            onClick={onOpenSchedule}
            className={`rounded-full bg-neutral-950 border-2 border-neutral-700 hover:border-red-500 active:scale-95 text-white flex flex-col items-center justify-center transition-all cursor-pointer ${
              isTvLarge ? 'w-18 h-18' : 'w-16 h-16'
            }`}
            title="ผังรายการ (EPG)"
          >
            <span className="text-xs font-bold text-red-400">OK</span>
            <span className="text-[9px] text-neutral-400">ผังรายการ</span>
          </button>

          <button
            onClick={onNextChannel}
            className={`rounded-2xl bg-neutral-800 hover:bg-red-600 active:scale-95 text-white flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-lg ${
              isTvLarge ? 'w-20 h-16' : 'w-16 h-14'
            }`}
            title="ช่องถัดไป"
          >
            <ChevronDown className="w-6 h-6" />
            <span className="text-[10px] font-bold">CH +</span>
          </button>
        </div>
      </div>

      {/* Number Keypad (0-9) */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className={`rounded-xl bg-neutral-800/90 hover:bg-neutral-700 active:bg-red-600 font-bold font-mono text-white transition-all cursor-pointer flex items-center justify-center ${
              isTvLarge ? 'h-14 text-xl' : 'h-11 text-base'
            }`}
          >
            {digit}
          </button>
        ))}
        <button
          onClick={handleClear}
          className={`rounded-xl bg-neutral-800/60 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
            isTvLarge ? 'h-14' : 'h-11'
          }`}
          title="ล้างตัวเลข"
        >
          CLEAR
        </button>
        <button
          onClick={() => handleDigit('0')}
          className={`rounded-xl bg-neutral-800/90 hover:bg-neutral-700 active:bg-red-600 font-bold font-mono text-white transition-all cursor-pointer flex items-center justify-center ${
            isTvLarge ? 'h-14 text-xl' : 'h-11 text-base'
          }`}
        >
          0
        </button>
        <button
          onClick={handleConfirm}
          className={`rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
            isTvLarge ? 'h-14' : 'h-11'
          }`}
        >
          <CornerDownLeft className="w-4 h-4" />
          <span>GO</span>
        </button>
      </div>

      {/* Function Shortcuts */}
      <div className="mt-4 pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={onToggleMute}
          className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer ${
            isMuted 
              ? 'bg-red-950/40 border-red-500 text-red-400' 
              : 'bg-neutral-800/80 border-neutral-700 text-neutral-200 hover:text-white'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}</span>
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 hover:text-white flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
          <span>เต็มจอ</span>
        </button>

        <button
          onClick={onToggleProxy}
          className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer ${
            useProxy 
              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300' 
              : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:text-white'
          }`}
          title="สลับใช้งานระบบ Stream Proxy"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{useProxy ? 'Proxy: เปิด' : 'Proxy: ปิด'}</span>
        </button>

        <button
          onClick={onToggleViewMode}
          className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700 hover:bg-neutral-700 text-neutral-200 hover:text-white flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
          title="เปลี่ยนขนาดปุ่มสำหรับ Smart TV หรือ Fire TV"
        >
          <Tv className="w-4 h-4 text-amber-400" />
          <span>
            {viewMode === 'tv' ? 'ขนาดปุ่ม: ใหญ่' : viewMode === 'tv-compact' ? 'ขนาดปุ่ม: เล็ก' : 'ขนาดปกติ'}
          </span>
        </button>
      </div>

      {/* Keyboard Quick Help for Smart TV / Fire TV Remote users */}
      <div className="mt-auto pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
        <p className="font-semibold text-neutral-300 mb-1">คีย์ลัดรีโมท Fire TV / คีย์บอร์ด:</p>
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div><kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-300">↑</kbd> / <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-300">↓</kbd> เปลี่ยนช่อง</div>
          <div><kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-300">0-9</kbd> พิมพ์เลขช่อง</div>
          <div><kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-300">Space</kbd> เล่น/หยุด</div>
          <div><kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-300">F</kbd> เต็มจอ</div>
        </div>
      </div>
    </div>
  );
};
