import React from 'react';
import { X, Clock, Radio, Calendar, ChevronRight } from 'lucide-react';
import { ChannelItem, Program } from '../types';
import { generateScheduleForChannel } from '../data/channels';

interface EPGScheduleModalProps {
  channel: ChannelItem;
  isOpen: boolean;
  onClose: () => void;
  onSelectChannel?: (channel: ChannelItem) => void;
  allChannels?: ChannelItem[];
}

export const EPGScheduleModal: React.FC<EPGScheduleModalProps> = ({
  channel,
  isOpen,
  onClose,
  onSelectChannel,
  allChannels = []
}) => {
  if (!isOpen) return null;

  const { current, next, full } = generateScheduleForChannel(channel);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fadeIn">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            {channel.logo ? (
              <img
                src={channel.logo}
                alt={channel.title}
                className="w-12 h-12 object-contain bg-neutral-900 rounded-xl p-1.5 border border-neutral-800"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 font-bold flex items-center justify-center text-lg">
                {channel.remotetv || 'TV'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                {channel.remotetv && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded">
                    CH {channel.remotetv}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">{channel.title}</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                ผังรายการออกอากาศประจำวัน (EPG Guide)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Playing Highlight Banner */}
        {current && (
          <div className="bg-red-950/40 border-b border-red-900/40 p-4 flex items-start gap-3">
            <span className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-900/60 px-2 py-0.5 rounded border border-red-700/50 shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              กำลังออกอากาศ
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base">{current.title}</h4>
                <span className="text-xs text-red-300 font-mono font-medium">
                  {current.startTime} - {current.endTime}
                </span>
              </div>
              {current.description && (
                <p className="text-xs text-neutral-300 mt-1">{current.description}</p>
              )}
            </div>
          </div>
        )}

        {/* 24-Hour Schedule Timeline List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            รายการตลอดทั้งวัน
          </div>
          {full.map((prog, idx) => {
            const isNow = prog.id === current?.id;
            return (
              <div
                key={prog.id || idx}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isNow
                    ? 'bg-neutral-800/90 border-red-500/80 shadow-md shadow-red-950/20'
                    : 'bg-neutral-950/40 border-neutral-800/80 hover:bg-neutral-850'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                    isNow ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {prog.startTime}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${isNow ? 'text-white' : 'text-neutral-200'}`}>
                        {prog.title}
                      </p>
                      {isNow && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700 px-1.5 py-0.2 rounded">
                          ON AIR
                        </span>
                      )}
                    </div>
                    {prog.description && (
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                        {prog.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-neutral-500 font-mono text-right shrink-0">
                  {prog.durationMinutes} นาที
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
