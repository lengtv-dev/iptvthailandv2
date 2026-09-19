import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChannelItem, Category, ViewMode } from './types';
import { DEFAULT_CATEGORIES, getInitialChannels, generateScheduleForChannel } from './data/channels';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { ChannelList } from './components/ChannelList';
import { TVRemote } from './components/TVRemote';
import { EPGScheduleModal } from './components/EPGScheduleModal';
import { PlaylistModal } from './components/PlaylistModal';
import { Tv, Heart, Radio, ShieldCheck, ListPlus, Sliders, Smartphone, Laptop, Tablet } from 'lucide-react';

const STORAGE_KEY_CHANNELS = 'livetv_channels_v1';
const STORAGE_KEY_FAVORITES = 'livetv_favorites_v1';
const STORAGE_KEY_VIEWMODE = 'livetv_viewmode_v1';
const STORAGE_KEY_USEPROXY = 'livetv_useproxy_v1';
const STORAGE_KEY_ACTIVE_CID = 'livetv_active_cid_v1';

export default function App() {
  // Channels state
  const [channels, setChannels] = useState<ChannelItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHANNELS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return getInitialChannels();
  });

  // Favorites state
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
    return new Set<string>();
  });

  // Active channel
  const [activeChannel, setActiveChannel] = useState<ChannelItem>(() => {
    const defaultChannels = channels.length > 0 ? channels : getInitialChannels();
    const savedCid = localStorage.getItem(STORAGE_KEY_ACTIVE_CID);
    if (savedCid) {
      const found = defaultChannels.find(c => c.cid === savedCid);
      if (found) return found;
    }
    // Default to Channel 33 (ช่อง 3 HD) or Channel 35 (7 HD) or first
    return defaultChannels.find(c => c.remotetv === '33') || 
           defaultChannels.find(c => c.remotetv === '35') || 
           defaultChannels[0];
  });

  // Category & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // TV View Mode: 'normal', 'tv' (big buttons for Fire TV), 'tv-compact' (small buttons for smart tv)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(STORAGE_KEY_VIEWMODE) as ViewMode) || 'normal';
  });

  // Proxy streaming flag (Default: true as requested by user)
  const [useProxy, setUseProxy] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USEPROXY);
    return saved !== null ? saved === 'true' : true;
  });

  // Modals state
  const [isRemoteOpen, setIsRemoteOpen] = useState<boolean>(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
  const [scheduleModalChannel, setScheduleModalChannel] = useState<ChannelItem | null>(null);

  // Quick Channel Number OSD (On-Screen Display) when pressing 0-9 on remote
  const [quickNumberInput, setQuickNumberInput] = useState<string>('');
  const [osdBanner, setOsdBanner] = useState<string | null>(null);

  // Sync favorites to channels
  const channelsWithFavorites = useMemo(() => {
    return channels.map(ch => ({
      ...ch,
      favorite: favorites.has(ch.cid)
    }));
  }, [channels, favorites]);

  // Filter channels by category and search
  const filteredChannels = useMemo(() => {
    let result = channelsWithFavorites;

    // Category filter
    if (selectedCategory === 'favorite') {
      result = result.filter(c => c.favorite);
    } else if (selectedCategory !== 'all') {
      result = result.filter(c => c.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(query) || 
        c.remotetv.includes(query) ||
        (c.category && c.category.toLowerCase().includes(query))
      );
    }

    return result;
  }, [channelsWithFavorites, selectedCategory, searchQuery]);

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VIEWMODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USEPROXY, String(useProxy));
  }, [useProxy]);

  useEffect(() => {
    if (activeChannel?.cid) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_CID, activeChannel.cid);
    }
  }, [activeChannel]);

  // Toggle favorite
  const handleToggleFavorite = (cid: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(cid)) {
        next.delete(cid);
      } else {
        next.add(cid);
      }
      return next;
    });
  };

  // Switch channel
  const handleSelectChannel = useCallback((channel: ChannelItem) => {
    setActiveChannel(channel);
    setOsdBanner(`CH ${channel.remotetv ? channel.remotetv + ' : ' : ''}${channel.title}`);
    setTimeout(() => setOsdBanner(null), 3000);
  }, []);

  // Next / Previous Channel
  const handleNextChannel = useCallback(() => {
    const list = filteredChannels.length > 0 ? filteredChannels : channelsWithFavorites;
    const currentIndex = list.findIndex(c => c.cid === activeChannel.cid);
    const nextIndex = (currentIndex + 1) % list.length;
    handleSelectChannel(list[nextIndex]);
  }, [filteredChannels, channelsWithFavorites, activeChannel.cid, handleSelectChannel]);

  const handlePrevChannel = useCallback(() => {
    const list = filteredChannels.length > 0 ? filteredChannels : channelsWithFavorites;
    const currentIndex = list.findIndex(c => c.cid === activeChannel.cid);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    handleSelectChannel(list[prevIndex]);
  }, [filteredChannels, channelsWithFavorites, activeChannel.cid, handleSelectChannel]);

  // Select channel by remote number (e.g. "33" -> ช่อง 3)
  const handleSelectByNumber = useCallback((numberStr: string) => {
    const found = channelsWithFavorites.find(c => c.remotetv === numberStr) || 
                  channelsWithFavorites.find(c => c.remotetv.startsWith(numberStr));
    if (found) {
      handleSelectChannel(found);
    } else {
      setOsdBanner(`ไม่พบช่องหมายเลข ${numberStr}`);
      setTimeout(() => setOsdBanner(null), 2500);
    }
  }, [channelsWithFavorites, handleSelectChannel]);

  // Remote keypress listener (for Fire TV remote / Smart TV keyboards)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Digits 0-9 for channel switching
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setQuickNumberInput(prev => {
          const next = (prev + e.key).slice(0, 4);
          setOsdBanner(`CH ${next}`);
          return next;
        });
        return;
      }

      if (e.key === 'Enter' && quickNumberInput) {
        e.preventDefault();
        handleSelectByNumber(quickNumberInput);
        setQuickNumberInput('');
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handlePrevChannel();
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleNextChannel();
          break;
        case 'f':
        case 'F': {
          const container = document.getElementById('live-video-player-container');
          if (container) {
            if (!document.fullscreenElement) {
              container.requestFullscreen().catch(console.error);
            } else {
              document.exitFullscreen().catch(console.error);
            }
          }
          break;
        }
        case 't':
        case 'T':
          setViewMode(curr => curr === 'normal' ? 'tv' : curr === 'tv' ? 'tv-compact' : 'normal');
          break;
        case 'p':
        case 'P':
          setUseProxy(prev => !prev);
          break;
        case 'i':
        case 'I':
          setScheduleModalChannel(activeChannel);
          break;
        case 'Escape':
          setIsRemoteOpen(false);
          setScheduleModalChannel(null);
          setIsPlaylistModalOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickNumberInput, handleSelectByNumber, handleNextChannel, handlePrevChannel, activeChannel]);

  // Timeout submit for buffered number input
  useEffect(() => {
    if (!quickNumberInput) return;
    const timer = setTimeout(() => {
      handleSelectByNumber(quickNumberInput);
      setQuickNumberInput('');
    }, 1500);
    return () => clearTimeout(timer);
  }, [quickNumberInput, handleSelectByNumber]);

  // Import Channels
  const handleImportChannels = (newChannels: ChannelItem[], append: boolean) => {
    if (append) {
      setChannels(prev => {
        const existingIds = new Set(prev.map(c => c.cid));
        const toAdd = newChannels.filter(c => !existingIds.has(c.cid));
        return [...prev, ...toAdd];
      });
    } else {
      setChannels(newChannels);
      if (newChannels.length > 0) {
        setActiveChannel(newChannels[0]);
      }
    }
  };

  const handleResetToDefault = () => {
    const initial = getInitialChannels();
    setChannels(initial);
    setActiveChannel(initial[0]);
    localStorage.removeItem(STORAGE_KEY_CHANNELS);
  };

  // EPG info for active channel
  const { current: currentProg, next: nextProg } = useMemo(() => {
    return generateScheduleForChannel(activeChannel);
  }, [activeChannel]);

  const cycleViewMode = () => {
    setViewMode(curr => {
      if (curr === 'normal') return 'tv';
      if (curr === 'tv') return 'tv-compact';
      return 'normal';
    });
  };

  return (
    <div className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-['Prompt',sans-serif] ${
      viewMode === 'tv' ? 'text-lg' : ''
    }`}>
      {/* On-Screen Display HUD Banner for TV/Remote notifications */}
      {osdBanner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/95 border-2 border-red-500 text-white font-mono font-bold text-base sm:text-xl px-6 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md animate-bounce">
          {osdBanner}
        </div>
      )}

      {/* Top Navbar */}
      <Header
        categories={DEFAULT_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onCycleViewMode={cycleViewMode}
        onOpenRemote={() => setIsRemoteOpen(true)}
        onOpenPlaylistModal={() => setIsPlaylistModalOpen(true)}
        useProxy={useProxy}
        onToggleProxy={() => setUseProxy(prev => !prev)}
        favoritesCount={favorites.size}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col gap-4">
        {/* Video Player Section */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800/80 shadow-2xl bg-black">
          <VideoPlayer
            channel={activeChannel}
            currentProgram={currentProg}
            nextProgram={nextProg}
            useProxy={useProxy}
            onToggleProxy={() => setUseProxy(prev => !prev)}
            onPrevChannel={handlePrevChannel}
            onNextChannel={handleNextChannel}
            viewMode={viewMode}
            onToggleViewMode={cycleViewMode}
            onOpenSchedule={() => setScheduleModalChannel(activeChannel)}
          />
        </div>

        {/* Channel Information & Guide Summary Bar */}
        <div className="bg-neutral-900/70 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {activeChannel.logo && (
              <img
                src={activeChannel.logo}
                alt={activeChannel.title}
                className="w-10 h-10 object-contain rounded-lg p-1 bg-neutral-950 border border-neutral-800 shrink-0"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                {activeChannel.remotetv && (
                  <span className="font-mono text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded">
                    CH {activeChannel.remotetv}
                  </span>
                )}
                <h2 className="text-base sm:text-lg font-bold text-white">{activeChannel.title}</h2>
                <button
                  onClick={(e) => handleToggleFavorite(activeChannel.cid, e)}
                  className="p-1 rounded-md text-neutral-400 hover:text-red-400 transition-colors"
                  title={activeChannel.favorite ? "เอาออกจากรายการโปรด" : "เพิ่มเป็นรายการโปรด"}
                >
                  <Heart className={`w-4 h-4 ${activeChannel.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {currentProg && (
                <p className="text-xs text-neutral-300 mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-white">{currentProg.title}</span>
                  <span className="text-neutral-400 font-mono">({currentProg.startTime} - {currentProg.endTime})</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setScheduleModalChannel(activeChannel)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700/60 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-red-400" />
              <span>ดูผังรายการ 24 ชม.</span>
            </button>

            <button
              onClick={() => setIsRemoteOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>รีโมทคอนโทรล</span>
            </button>
          </div>
        </div>

        {/* Section Header: Channels List */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-base sm:text-lg text-white">
              {selectedCategory === 'all' 
                ? 'ตารางช่องทีวีทั้งหมด' 
                : DEFAULT_CATEGORIES.find(c => c.id === selectedCategory)?.title || 'ช่องทีวี'}
            </h3>
            <span className="text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full font-mono">
              {filteredChannels.length} ช่อง
            </span>
          </div>

          {/* Quick Category Badges */}
          <div className="text-xs text-neutral-400 hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-neutral-500" /> มือถือ
            </span>
            <span className="flex items-center gap-1">
              <Tablet className="w-3.5 h-3.5 text-neutral-500" /> iPad
            </span>
            <span className="flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5 text-neutral-500" /> PC
            </span>
            <span className="flex items-center gap-1 text-red-400 font-medium">
              <Tv className="w-3.5 h-3.5" /> Fire TV & Smart TV
            </span>
          </div>
        </div>

        {/* Channels Grid / List */}
        <ChannelList
          channels={filteredChannels}
          activeChannel={activeChannel}
          onSelectChannel={handleSelectChannel}
          onToggleFavorite={handleToggleFavorite}
          onOpenSchedule={(ch, e) => {
            e.stopPropagation();
            setScheduleModalChannel(ch);
          }}
          viewMode={viewMode}
        />
      </main>

      {/* Floating Quick Remote Button (Mobile / TV friendly) */}
      <button
        id="floating-remote-btn"
        onClick={() => setIsRemoteOpen(true)}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white shadow-2xl flex items-center justify-center transition-all cursor-pointer border-2 border-red-400/50 group"
        title="เปิดรีโมทกดเลขช่อง"
      >
        <Sliders className="w-6 h-6 group-hover:rotate-45 transition-transform" />
      </button>

      {/* Modals */}
      <TVRemote
        isOpen={isRemoteOpen}
        onClose={() => setIsRemoteOpen(false)}
        onSelectChannelNumber={handleSelectByNumber}
        onPrevChannel={handlePrevChannel}
        onNextChannel={handleNextChannel}
        onToggleMute={() => {
          const video = document.getElementById('hls-live-video') as HTMLVideoElement;
          if (video) video.muted = !video.muted;
        }}
        isMuted={false}
        onToggleFullscreen={() => {
          const container = document.getElementById('live-video-player-container');
          if (container) {
            if (!document.fullscreenElement) {
              container.requestFullscreen().catch(console.error);
            } else {
              document.exitFullscreen().catch(console.error);
            }
          }
        }}
        onOpenSchedule={() => setScheduleModalChannel(activeChannel)}
        useProxy={useProxy}
        onToggleProxy={() => setUseProxy(prev => !prev)}
        viewMode={viewMode}
        onToggleViewMode={cycleViewMode}
      />

      {scheduleModalChannel && (
        <EPGScheduleModal
          channel={scheduleModalChannel}
          isOpen={!!scheduleModalChannel}
          onClose={() => setScheduleModalChannel(null)}
        />
      )}

      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onImportChannels={handleImportChannels}
        currentChannels={channels}
        onResetToDefault={handleResetToDefault}
      />

      {/* Footer */}
      <footer className="mt-8 border-t border-neutral-900 py-6 px-4 text-center text-xs text-neutral-500 bg-neutral-950/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ระบบ Live TV พร้อม Stream Proxy และ EPG Guide 24 ชั่วโมง</span>
          </div>
          <p>
            รองรับการใช้งานบน Fire TV, Smart TV, Android TV, iPad, โทรศัพท์ และ PC
          </p>
        </div>
      </footer>
    </div>
  );
}
