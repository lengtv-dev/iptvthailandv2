import React from 'react';
import { Heart, Radio, Calendar, Play } from 'lucide-react';
import { ChannelItem, ViewMode } from '../types';
import { generateScheduleForChannel } from '../data/channels';

interface ChannelListProps {
  channels: ChannelItem[];
  activeChannel: ChannelItem;
  onSelectChannel: (channel: ChannelItem) => void;
  onToggleFavorite: (channelId: string, e: React.MouseEvent) => void;
  onOpenSchedule: (channel: ChannelItem, e: React.MouseEvent) => void;
  viewMode: ViewMode;
  focusedIndex?: number;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  activeChannel,
  onSelectChannel,
  onToggleFavorite,
  onOpenSchedule,
  viewMode,
  focusedIndex
}) => {
  if (channels.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-400">
        <Radio className="w-12 h-12 mx-auto mb-3 text-neutral-600 animate-pulse" />
        <p className="text-base font-medium text-neutral-300">ไม่พบช่องที่ตรงกับเงื่อนไข</p>
        <p className="text-xs text-neutral-500 mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</p>
      </div>
    );
  }

  const isTvLarge = viewMode === 'tv';
  const isTvCompact = viewMode === 'tv-compact';

  return (
    <div className="w-full">
      <div 
        id="channels-grid-container"
        className={`grid gap-2.5 sm:gap-3 ${
          isTvLarge 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
            : isTvCompact 
            ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8' 
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
        }`}
      >
        {channels.map((channel, index) => {
          const isActive = channel.cid === activeChannel.cid;
          const isFocused = focusedIndex === index;
          const { current } = generateScheduleForChannel(channel);

          return (
            <div
              key={channel.cid}
              id={`channel-card-${channel.cid}`}
              tabIndex={0}
              onClick={() => onSelectChannel(channel)}
              className={`group relative rounded-2xl border transition-all duration-150 cursor-pointer overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-neutral-850 border-red-500 ring-2 ring-red-500/80 shadow-lg shadow-red-950/40'
                  : isFocused
                  ? 'bg-neutral-800 border-amber-400 ring-4 ring-amber-400/80 scale-[1.02] shadow-xl'
                  : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
              } ${isTvLarge ? 'p-3.5 sm:p-4 min-h-[140px]' : isTvCompact ? 'p-2 sm:p-2.5 min-h-[105px]' : 'p-3 min-h-[120px]'}`}
            >
              {/* Top Row: Channel Number & Favorite Button */}
              <div className="flex items-center justify-between gap-1 w-full">
                {channel.remotetv ? (
                  <span className={`font-mono font-bold rounded px-1.5 py-0.5 text-white shadow-xs ${
                    isActive ? 'bg-red-600' : 'bg-neutral-800 text-neutral-300'
                  } ${isTvLarge ? 'text-xs' : 'text-[10px]'}`}>
                    CH {channel.remotetv}
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-500 font-mono">LIVE</span>
                )}

                <div className="flex items-center gap-1">
                  {/* Schedule preview button */}
                  <button
                    onClick={(e) => onOpenSchedule(channel, e)}
                    className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors opacity-80 group-hover:opacity-100"
                    title="ดูผังรายการช่องนี้"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => onToggleFavorite(channel.cid, e)}
                    className="p-1 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-800/80 transition-colors"
                    title={channel.favorite ? "เอาออกจากรายการโปรด" : "เพิ่มเป็นรายการโปรด"}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        channel.favorite ? 'fill-red-500 text-red-500' : 'text-neutral-400'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Center: Channel Logo and Active Pulse */}
              <div className="my-2 flex flex-col items-center justify-center text-center">
                <div className="relative">
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.title}
                      loading="lazy"
                      className={`object-contain rounded-lg p-1 bg-neutral-950/60 border border-neutral-800/60 group-hover:scale-105 transition-transform ${
                        isTvLarge ? 'w-14 h-14' : isTvCompact ? 'w-9 h-9' : 'w-11 h-11'
                      }`}
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className={`rounded-lg bg-red-600/10 text-red-500 font-bold flex items-center justify-center border border-red-500/20 ${
                      isTvLarge ? 'w-14 h-14 text-lg' : isTvCompact ? 'w-9 h-9 text-xs' : 'w-11 h-11 text-sm'
                    }`}>
                      {channel.remotetv || 'TV'}
                    </div>
                  )}

                  {isActive && (
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                  )}
                </div>

                <h3 className={`font-semibold text-white mt-2 truncate max-w-full tracking-tight ${
                  isTvLarge ? 'text-sm' : isTvCompact ? 'text-[11px]' : 'text-xs'
                }`}>
                  {channel.title}
                </h3>
              </div>

              {/* Bottom: On-Air Snippet */}
              {current && !isTvCompact && (
                <div className="pt-1.5 border-t border-neutral-800/80 flex items-center gap-1 text-[10px] text-neutral-400 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{current.title}</span>
                </div>
              )}

              {/* Play Hover Overlay for quick click */}
              <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
