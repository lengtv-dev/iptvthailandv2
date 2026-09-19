import React from 'react';
import { 
  Tv, Search, Heart, ShieldCheck, ShieldAlert, 
  ListPlus, Radio, Sliders, Smartphone, Laptop
} from 'lucide-react';
import { Category, ViewMode } from '../types';

interface HeaderProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onCycleViewMode: () => void;
  onOpenRemote: () => void;
  onOpenPlaylistModal: () => void;
  useProxy: boolean;
  onToggleProxy: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  viewMode,
  onCycleViewMode,
  onOpenRemote,
  onOpenPlaylistModal,
  useProxy,
  onToggleProxy,
  favoritesCount
}) => {
  const isTvLarge = viewMode === 'tv';
  const isTvCompact = viewMode === 'tv-compact';

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-950/50">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-white tracking-tight flex items-center gap-1.5">
                LIVE TV <span className="text-red-500 text-xs px-1.5 py-0.5 rounded bg-red-950/60 border border-red-800/50">TH</span>
              </h1>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">ทีวีถ่ายทอดสด & ผังรายการ HLS Player</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="channel-search-input"
            type="text"
            placeholder="ค้นหาชื่อช่อง หรือเลขรีโมท (เช่น 33, ช่อง 7, HBO)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700/70 rounded-full pl-9 pr-4 py-1.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-red-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Controls: TV Mode Switch, Remote, Playlist, Proxy */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* TV Mode Switcher */}
          <button
            id="header-tv-mode-btn"
            onClick={onCycleViewMode}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isTvLarge
                ? 'bg-red-600 text-white shadow-md shadow-red-900/40 ring-2 ring-red-500/50'
                : isTvCompact
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60'
            }`}
            title="สลับโหมด: ปกติ / โหมดทีวี (ปุ่มใหญ่ Fire TV) / โหมดทีวี (ปุ่มเล็ก Smart TV)"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {isTvLarge ? 'โหมดทีวี (ปุ่มใหญ่)' : isTvCompact ? 'โหมดทีวี (ปุ่มเล็ก)' : 'โหมดปกติ'}
            </span>
            <span className="md:hidden">
              {isTvLarge ? 'TV ใหญ่' : isTvCompact ? 'TV เล็ก' : 'ปกติ'}
            </span>
          </button>

          {/* Virtual Remote Button */}
          <button
            id="header-remote-btn"
            onClick={onOpenRemote}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="เปิดรีโมทเสมือน (กดเลขช่อง 0-9)"
          >
            <Sliders className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">รีโมท</span>
          </button>

          {/* Add Playlist / Channels */}
          <button
            id="header-playlist-btn"
            onClick={onOpenPlaylistModal}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="นำเข้าเพลย์ลิสต์ M3U / W3U / TXT / JSON"
          >
            <ListPlus className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">+เพลย์ลิสต์</span>
          </button>

          {/* Proxy Status Indicator Toggle */}
          <button
            id="header-proxy-btn"
            onClick={onToggleProxy}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1 transition-colors cursor-pointer ${
              useProxy
                ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title={useProxy ? 'Proxy สตรีมเปิดอยู่ (ช่วยป้องกันปัญหา CORS)' : 'Direct Stream (ปิด Proxy)'}
          >
            {useProxy ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-neutral-400" />}
            <span className="hidden lg:inline">{useProxy ? 'Proxy ON' : 'Proxy OFF'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 border-t border-neutral-900/80">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const isFav = cat.id === 'favorite';
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-red-600 text-white font-semibold shadow-sm'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              {isFav && <Heart className={`w-3.5 h-3.5 ${isSelected ? 'fill-white' : 'fill-red-500 text-red-500'}`} />}
              <span>{cat.title}</span>
              {isFav && favoritesCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-red-800 text-white' : 'bg-neutral-800 text-neutral-300'}`}>
                  {favoritesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
