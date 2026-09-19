import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, 
  RotateCcw, ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight,
  Tv, Radio, Info, Settings, Scaling
} from 'lucide-react';
import { ChannelItem, Program, AspectRatio, ViewMode } from '../types';
import { getProxyStreamUrl } from '../data/channels';

interface VideoPlayerProps {
  channel: ChannelItem;
  currentProgram?: Program;
  nextProgram?: Program;
  useProxy: boolean;
  onToggleProxy: () => void;
  onPrevChannel: () => void;
  onNextChannel: () => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onOpenSchedule: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  channel,
  currentProgram,
  nextProgram,
  useProxy,
  onToggleProxy,
  onPrevChannel,
  onNextChannel,
  viewMode,
  onToggleViewMode,
  onOpenSchedule
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [showControls, setShowControls] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [streamQuality, setStreamQuality] = useState<string>('Auto');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showChannelBanner, setShowChannelBanner] = useState<boolean>(true);

  // Controls auto-hide timer
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 4000);
  };

  const handleUserActivity = () => {
    resetHideTimer();
  };

  // Determine current active URL
  const rawUrl = channel.streamUrl || `https://s.okwin321.ai/ngz168/${channel.cid}/playlist.m3u8`;
  const streamSrc = useProxy ? getProxyStreamUrl(rawUrl) : rawUrl;

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);
    setErrorMsg(null);
    setShowChannelBanner(true);
    const bannerTimeout = setTimeout(() => setShowChannelBanner(false), 5000);

    // Destroy existing hls
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHlsSupported = Hls.isSupported();
    const canPlayNativeHls = video.canPlayType('application/vnd.apple.mpegurl');

    if (isHlsSupported) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hlsRef.current = hls;

      hls.loadSource(streamSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setLoading(false);
        const levels = data.levels.map(l => `${l.height}p`);
        setAvailableQualities(['Auto', ...levels]);
        video.play().catch(() => {
          // Autoplay policy might require mute
          video.muted = true;
          setIsMuted(true);
          video.play().catch(e => console.log('Autoplay blocked:', e));
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const level = hls.levels[data.level];
        if (level) {
          setStreamQuality(`${level.height}p`);
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('Fatal HLS Error:', data.type, data.details);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMsg(useProxy 
                ? 'ไม่สามารถโหลดสัญญาณสตรีมได้ โปรดลองสลับช่องหรือรีเฟรช' 
                : 'เกิดปัญหาเชื่อมต่อ (แนะนำเปิดโหมด Proxy เพื่อเลี่ยง CORS)'
              );
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorMsg('ไม่สามารถเล่นสตรีมช่องนี้ได้ในขณะนี้');
              break;
          }
          setLoading(false);
        }
      });
    } else if (canPlayNativeHls) {
      // Safari / iOS native HLS support
      video.src = streamSrc;
      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(e => console.log(e));
        });
      });
      video.addEventListener('error', () => {
        setErrorMsg('เกิดข้อผิดพลาดในการโหลดสตรีม');
        setLoading(false);
      });
    } else {
      setErrorMsg('เบราว์เซอร์นี้ไม่รองรับการเล่น HLS (.m3u8)');
      setLoading(false);
    }

    return () => {
      clearTimeout(bannerTimeout);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.cid, channel.streamUrl, useProxy]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (newVol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVol;
    setVolume(newVol);
    if (newVol === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Fullscreen request failed:', err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleReload = () => {
    setLoading(true);
    setErrorMsg(null);
    if (hlsRef.current) {
      hlsRef.current.loadSource(streamSrc);
      hlsRef.current.startLoad();
    } else if (videoRef.current) {
      videoRef.current.src = streamSrc;
      videoRef.current.load();
    }
  };

  // Video object-fit class based on aspect ratio
  const getObjectFitStyle = () => {
    switch (aspectRatio) {
      case '16:9': return 'object-contain aspect-video';
      case '4:3': return 'object-contain aspect-[4/3]';
      case 'fill': return 'object-fill w-full h-full';
      case 'contain': return 'object-contain w-full h-full';
      default: return 'object-contain w-full h-full';
    }
  };

  const isTvMode = viewMode === 'tv' || viewMode === 'tv-compact';
  const isTvLarge = viewMode === 'tv';

  return (
    <div 
      ref={containerRef}
      id="live-video-player-container"
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      className={`relative w-full bg-black overflow-hidden select-none flex items-center justify-center group ${
        isFullscreen ? 'h-screen' : 'h-[50vh] sm:h-[60vh] md:h-[68vh] lg:h-[74vh]'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        id="hls-live-video"
        className={`w-full max-h-full ${getObjectFitStyle()} transition-all duration-200`}
        playsInline
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
      />

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs pointer-events-none z-20">
          <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin mb-3"></div>
          <p className="text-white text-sm font-medium tracking-wide flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
            กำลังโหลดสัญญาณสด ({channel.title})...
          </p>
        </div>
      )}

      {/* Error Overlay */}
      {errorMsg && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/90 text-center px-6 z-30">
          <ShieldAlert className="w-14 h-14 text-amber-500 mb-3 animate-bounce" />
          <h3 className="text-lg font-bold text-white mb-2">{channel.title}</h3>
          <p className="text-neutral-300 text-sm max-w-md mb-4">{errorMsg}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="player-retry-btn"
              onClick={handleReload}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> ลองโหลดใหม่
            </button>
            <button
              id="player-toggle-proxy-btn"
              onClick={onToggleProxy}
              className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                useProxy ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50' : 'bg-emerald-600 text-white'
              }`}
            >
              {useProxy ? 'สลับเป็น Direct Stream' : 'เปิดใช้งาน Stream Proxy'}
            </button>
          </div>
        </div>
      )}

      {/* Quick Channel Changing Banner HUD (Top Left) */}
      {showChannelBanner && (
        <div className="absolute top-4 left-4 z-20 bg-neutral-950/85 backdrop-blur-md border border-neutral-800/80 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-opacity duration-300 pointer-events-none animate-fadeIn">
          {channel.logo ? (
            <img 
              src={channel.logo} 
              alt={channel.title}
              className="w-10 h-10 object-contain bg-neutral-900 rounded-lg p-1 border border-neutral-800"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
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
              <h2 className="text-base font-bold text-white">{channel.title}</h2>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
              </span>
            </div>
            {currentProgram && (
              <p className="text-xs text-neutral-400 truncate max-w-[260px] sm:max-w-xs mt-0.5">
                กำลังออกอากาศ: <span className="text-neutral-200">{currentProgram.title}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* TV Mode Quick Direct Stream / Proxy Indicator (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={onToggleProxy}
          title={useProxy ? "สตรีมผ่าน CORS Proxy (กำลังเปิดใช้งาน)" : "สตรีมตรง Direct (อาจติด CORS บนบางเบราว์เซอร์)"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all cursor-pointer ${
            useProxy 
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/80' 
              : 'bg-neutral-900/80 text-neutral-400 border border-neutral-700 hover:text-neutral-200'
          }`}
        >
          {useProxy ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-neutral-400" />}
          <span className="hidden sm:inline">{useProxy ? 'Proxy สตรีม: เปิด' : 'Direct Stream'}</span>
          <span className="sm:hidden">{useProxy ? 'Proxy' : 'Direct'}</span>
        </button>

        {isTvMode && (
          <div className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <Tv className="w-3.5 h-3.5" />
            <span>TV Mode</span>
          </div>
        )}
      </div>

      {/* Center Left / Right Arrow Quick Switch on Hover */}
      <button
        id="player-prev-ch-btn"
        onClick={(e) => { e.stopPropagation(); onPrevChannel(); }}
        className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-sm transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer ${
          isTvLarge ? 'w-14 h-14' : 'w-10 h-10'
        }`}
        title="ช่องก่อนหน้า (กดลูกศร ซ้าย/ขึ้น)"
      >
        <ChevronLeft className={isTvLarge ? 'w-8 h-8' : 'w-6 h-6'} />
      </button>
      <button
        id="player-next-ch-btn"
        onClick={(e) => { e.stopPropagation(); onNextChannel(); }}
        className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-sm transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer ${
          isTvLarge ? 'w-14 h-14' : 'w-10 h-10'
        }`}
        title="ช่องถัดไป (กดลูกศร ขวา/ลง)"
      >
        <ChevronRight className={isTvLarge ? 'w-8 h-8' : 'w-6 h-6'} />
      </button>

      {/* Bottom Controls Bar */}
      <div 
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent p-4 z-20 transition-opacity duration-300 flex flex-col gap-2 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Current / Next Program Mini Guide Bar */}
        {currentProgram && (
          <div className="flex items-center justify-between text-xs text-neutral-300 bg-neutral-900/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-800/60">
            <div className="flex items-center gap-2 truncate">
              <Radio className="w-3.5 h-3.5 text-red-500 shrink-0 animate-pulse" />
              <span className="font-semibold text-white truncate">
                {currentProgram.startTime} - {currentProgram.endTime} : {currentProgram.title}
              </span>
            </div>
            {nextProgram && (
              <button 
                onClick={onOpenSchedule}
                className="hidden md:flex items-center gap-1 text-neutral-400 hover:text-white transition-colors ml-4 shrink-0 cursor-pointer"
              >
                <span>ถัดไป: {nextProgram.title} ({nextProgram.startTime})</span>
                <Info className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>
        )}

        {/* Primary Controls Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Controls: Play, Prev/Next, Volume */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="player-play-toggle"
              onClick={togglePlay}
              className={`rounded-xl flex items-center justify-center text-white transition-all cursor-pointer ${
                isTvLarge 
                  ? 'w-12 h-12 bg-red-600 hover:bg-red-500 shadow-lg text-lg' 
                  : 'w-10 h-10 bg-red-600/90 hover:bg-red-600'
              }`}
              title={isPlaying ? 'หยุดชั่วคราว (Space)' : 'เล่นต่อ (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={onPrevChannel}
                className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors cursor-pointer"
                title="ช่องก่อนหน้า"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={onNextChannel}
                className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors cursor-pointer"
                title="ช่องถัดไป"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors cursor-pointer"
                title={isMuted ? 'เปิดเสียง (M)' : 'ปิดเสียง (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-red-400" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 sm:w-24 accent-red-600 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
                title="ระดับเสียง"
              />
            </div>
          </div>

          {/* Right Controls: Aspect Ratio, Program Schedule, TV Mode, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Aspect Ratio Switcher */}
            <button
              id="player-aspect-ratio-btn"
              onClick={() => {
                const ratios: AspectRatio[] = ['16:9', '4:3', 'fill', 'contain'];
                const nextIdx = (ratios.indexOf(aspectRatio) + 1) % ratios.length;
                setAspectRatio(ratios[nextIdx]);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="เปลี่ยนอัตราส่วนภาพ (16:9 / 4:3 / เต็มจอ)"
            >
              <Scaling className="w-4 h-4" />
              <span className="hidden sm:inline">{aspectRatio.toUpperCase()}</span>
            </button>

            {/* Schedule View Button */}
            <button
              id="player-open-schedule-btn"
              onClick={onOpenSchedule}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="ดูตารางรายการช่องนี้ (EPG)"
            >
              <Info className="w-4 h-4 text-neutral-400" />
              <span className="hidden md:inline">ผังรายการ</span>
            </button>

            {/* TV Mode Toggle */}
            <button
              id="player-toggle-tvmode-btn"
              onClick={onToggleViewMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isTvMode
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
              }`}
              title="โหมดเบราว์เซอร์ทีวี / Fire TV"
            >
              <Tv className="w-4 h-4" />
              <span className="hidden sm:inline">
                {viewMode === 'tv' ? 'โหมดทีวี (ใหญ่)' : viewMode === 'tv-compact' ? 'โหมดทีวี (เล็ก)' : 'โหมดปกติ'}
              </span>
            </button>

            {/* Reload Stream */}
            <button
              onClick={handleReload}
              className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-lg transition-colors cursor-pointer"
              title="รีเฟรชสัญญาณ"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              id="player-fullscreen-btn"
              onClick={toggleFullscreen}
              className={`rounded-xl flex items-center justify-center text-white transition-all cursor-pointer ${
                isTvLarge 
                  ? 'w-11 h-11 bg-neutral-800 hover:bg-neutral-700' 
                  : 'p-2 text-neutral-300 hover:text-white hover:bg-neutral-800/80 rounded-lg'
              }`}
              title={isFullscreen ? 'ออกจากเต็มจอ (F)' : 'เต็มหน้าจอ (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
