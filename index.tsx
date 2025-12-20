
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
interface Station {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  notes?: string;
  isFavorite: boolean;
  addedAt: number;
}

type ViewState = 'LIST' | 'ADD' | 'SETTINGS' | 'FULL_PLAYER';

type ThemeColor = 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'black';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  themeColor: ThemeColor;
  showStreamUrl: boolean;
  iconStyle: 'circle' | 'square';
  sleepTimerAction: 'pause' | 'stop';
  resumePlayback: 'never' | 'always' | 'ask';
  networkType: 'any' | 'wifi';
}

interface RadioBrowserStation {
  changeuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  country: string;
  language: string;
  bitrate: number;
}

// --- Constants ---
const THEME_PALETTES: Record<ThemeColor, { primary: string, container: string, onContainer: string, active: string, surface: string, border: string, textSecondary: string }> = {
  purple: { primary: '#6750A4', container: '#EADDFF', onContainer: '#21005D', active: '#D0BCFF', surface: '#F7F2FA', border: '#E7E0EC', textSecondary: '#49454F' },
  blue: { primary: '#0061A4', container: '#D1E4FF', onContainer: '#001D36', active: '#A1C9FF', surface: '#F8FBFF', border: '#D1E4FF', textSecondary: '#49454F' },
  green: { primary: '#006D32', container: '#98FB9D', onContainer: '#00210A', active: '#7CFF9A', surface: '#F7FFF7', border: '#C0EED2', textSecondary: '#49454F' },
  red: { primary: '#BA1A1A', container: '#FFDAD6', onContainer: '#410002', active: '#FFB4AB', surface: '#FFF8F7', border: '#FFDAD6', textSecondary: '#49454F' },
  orange: { primary: '#8B5000', container: '#FFDDB3', onContainer: '#2C1600', active: '#FFB870', surface: '#FFF8F2', border: '#FFDDB3', textSecondary: '#49454F' },
  black: { primary: '#FFFFFF', container: '#1C1B1F', onContainer: '#E6E1E5', active: '#FFFFFF', surface: '#000000', border: '#313033', textSecondary: '#CAC4D0' },
};

// --- Icons ---
const Icons = {
  Radio: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.48" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M7.76 16.24a6 6 0 0 1 0-8.48" />
      <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
    </svg>
  ),
  Plus: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" cy="12" x2="19" y2="12" />
    </svg>
  ),
  Settings: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Play: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: (props: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  ),
  Star: (props: any) => (
    <svg viewBox="0 0 24 24" fill={props.active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Search: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  ChevronLeft: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  Timer: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Edit: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Share: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Trash: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Volume2: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  File: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Globe: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Palette: (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.4 2.1-1 .3-.4.6-.8 1-1 .4-.2.9-.3 1.4-.3 2.5 0 4.5-2 4.5-4.5 0-4.4-3.6-10.2-9-10.2z"/>
    </svg>
  )
};

// --- Utils ---
const parseM3U = (content: string): Partial<Station>[] => {
  const stations: Partial<Station>[] = [];
  const lines = content.split(/\r?\n/);
  let currentName: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      const parts = line.split(',');
      if (parts.length > 1) {
        currentName = parts.slice(1).join(',').trim();
      }
    } else if (!line.startsWith('#')) {
      stations.push({
        name: currentName || line.split('/').pop()?.split('?')[0] || 'Unknown Station',
        url: line,
      });
      currentName = undefined;
    }
  }
  return stations;
};

const resolvePlaylist = async (url: string): Promise<string> => {
  if (!url.toLowerCase().endsWith('.m3u') && !url.toLowerCase().endsWith('.pls')) return url;
  try {
    const response = await fetch(url);
    const text = await response.text();
    if (url.toLowerCase().endsWith('.m3u')) {
      const parsed = parseM3U(text);
      return parsed[0]?.url || url;
    } else if (url.toLowerCase().endsWith('.pls')) {
      const match = text.match(/File\d+=(.+)/i);
      return match ? match[1] : url;
    }
    return url;
  } catch (e) {
    console.warn('Playlist resolution failed, trying original URL', e);
    return url;
  }
};

// --- App Component ---
const App: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('LIST');
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    themeColor: 'purple',
    showStreamUrl: true,
    iconStyle: 'circle',
    sleepTimerAction: 'pause',
    resumePlayback: 'never',
    networkType: 'any'
  });
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // System Dark Mode Detection
  const [isSystemDark, setIsSystemDark] = useState(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerRef = useRef<number | null>(null);

  // Persistence & Dark Mode Listener
  useEffect(() => {
    const savedStations = localStorage.getItem('transistor_stations');
    if (savedStations) setStations(JSON.parse(savedStations));
    const savedSettings = localStorage.getItem('transistor_settings');
    if (savedSettings) setSettings(p => ({ ...p, ...JSON.parse(savedSettings) }));

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };
    darkModeMediaQuery.addEventListener('change', handleDarkModeChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('transistor_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('transistor_settings', JSON.stringify(settings));
  }, [settings]);

  // Audio Logic
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

    const audio = audioRef.current;
    
    const onPlay = () => { setIsPlaying(true); setIsLoading(false); };
    const onPause = () => { setIsPlaying(false); };
    const onWaiting = () => { setIsLoading(true); };
    const onCanPlay = () => { setIsLoading(false); };
    const onError = () => {
      const error = audio.error;
      let msg = "未知音频错误";
      if (error) {
        switch (error.code) {
          case 1: msg = "用户终止了音频加载"; break;
          case 2: msg = "由于网络问题，音频加载失败"; break;
          case 3: msg = "音频解码失败"; break;
          case 4: msg = "音频源不受支持或无法访问"; break;
        }
      }
      console.error('Audio Error Code:', error?.code, 'Message:', msg);
      alert(`播放失败: ${msg}`);
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, [volume, isMuted]);

  const togglePlay = useCallback(async (station?: Station) => {
    if (!audioRef.current) return;

    if (station) {
      if (activeStation?.id === station.id && isPlaying) {
        audioRef.current.pause();
      } else {
        setActiveStation(station);
        setIsLoading(true);
        const directUrl = await resolvePlaylist(station.url);
        audioRef.current.src = directUrl;
        audioRef.current.load();
        audioRef.current.play().catch(e => {
          console.error('Play aborted:', e);
          setIsLoading(false);
        });
      }
    } else if (activeStation) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        setIsLoading(true);
        audioRef.current.play().catch(e => {
          console.error('Play aborted:', e);
          setIsLoading(false);
        });
      }
    }
  }, [activeStation, isPlaying]);

  // Sleep Timer Logic
  useEffect(() => {
    if (sleepTimer !== null && sleepTimer > 0) {
      sleepTimerRef.current = window.setInterval(() => {
        setSleepTimer(prev => {
          if (prev && prev > 1) return prev - 1;
          
          if (audioRef.current) {
             audioRef.current.pause();
             if (settings.sleepTimerAction === 'stop') {
                setActiveStation(null);
             }
          }
          return null;
        });
      }, 60000);
    } else {
      if (sleepTimerRef.current) window.clearInterval(sleepTimerRef.current);
    }
    return () => {
      if (sleepTimerRef.current) window.clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimer, isPlaying, settings.sleepTimerAction]);

  // Sorted list logic: Favorites first, then by date added (newest first)
  const sortedStations = [...stations].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return b.addedAt - a.addedAt;
  });

  const addStation = (stationData: Partial<Station>) => {
    const newStation: Station = {
      id: crypto.randomUUID(),
      name: stationData.name || 'Unknown Station',
      url: stationData.url || '',
      iconUrl: stationData.iconUrl,
      notes: stationData.notes,
      isFavorite: false,
      addedAt: Date.now(),
    };
    setStations(prev => [...prev, newStation]);
  };

  const addStations = (stationList: Partial<Station>[]) => {
    const newStations = stationList.map(s => ({
      id: crypto.randomUUID(),
      name: s.name || 'Unknown Station',
      url: s.url || '',
      iconUrl: s.iconUrl,
      notes: s.notes,
      isFavorite: false,
      addedAt: Date.now(),
    }));
    setStations(prev => [...prev, ...newStations]);
    setCurrentView('LIST');
  };

  const deleteStation = (id: string) => {
    setStations(prev => prev.filter(s => s.id !== id));
    if (activeStation?.id === id) {
      audioRef.current?.pause();
      setActiveStation(null);
    }
  };

  const toggleFavorite = (id: string) => {
    setStations(prev => prev.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
  };

  const searchStations = async (query: string) => {
    if (!query) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/byname/${encodeURIComponent(query)}?limit=20`);
      const data: RadioBrowserStation[] = await response.json();
      const mapped: Station[] = data.map(s => ({
        id: s.changeuuid,
        name: s.name,
        url: s.url_resolved,
        iconUrl: s.favicon,
        notes: `${s.country} - ${s.language}`,
        isFavorite: false,
        addedAt: Date.now()
      }));
      setSearchResults(mapped);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Resolve palette - automatic switch to black if system is dark
  const activePalette = isSystemDark ? THEME_PALETTES['black'] : THEME_PALETTES[settings.themeColor];

  // --- Sub-components ---
  const Header = () => (
    <div className="sticky top-0 z-20 flex items-center justify-between px-4 h-16 bg-theme-surface border-b border-theme-border transition-colors duration-500">
      <div className="flex items-center gap-4">
        {currentView !== 'LIST' && (
          <button onClick={() => setCurrentView('LIST')} className="p-2 rounded-full hover:bg-black/5">
            <Icons.ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-medium tracking-tight text-theme-primary">
          {currentView === 'LIST' ? 'Transistor' : 
           currentView === 'ADD' ? '添加电台' : 
           currentView === 'SETTINGS' ? '设置' : '正在播放'}
        </h1>
      </div>
      <div className="flex items-center gap-1">
        {currentView === 'LIST' && (
          <>
            <button onClick={() => setCurrentView('ADD')} className="p-3 rounded-full hover:bg-black/5 text-theme-primary transition-colors">
              <Icons.Plus className="w-6 h-6" />
            </button>
            <button onClick={() => setCurrentView('SETTINGS')} className="p-3 rounded-full hover:bg-black/5 text-theme-primary transition-colors">
              <Icons.Settings className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const StationCard: React.FC<{ station: Station }> = ({ station }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-black/5 group transition-colors cursor-pointer" onClick={() => togglePlay(station)}>
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-theme-container text-theme-onContainer overflow-hidden transition-colors duration-500 ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-lg'}`}>
        {station.iconUrl ? (
          <img src={station.iconUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <Icons.Radio className="w-6 h-6" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium truncate flex items-center gap-2 text-theme-primary">
          {station.name}
          {station.isFavorite && <Icons.Star className="w-3 h-3 text-theme-primary fill-current transition-colors" active={true} />}
        </h3>
        {settings.showStreamUrl && <p className="text-sm text-theme-textSecondary truncate">{station.url}</p>}
      </div>
      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => toggleFavorite(station.id)} className={`p-2 rounded-full hover:bg-black/5 transition-colors ${station.isFavorite ? 'text-theme-primary' : 'text-theme-textSecondary'}`}>
          <Icons.Star className="w-5 h-5" active={station.isFavorite} />
        </button>
        <button onClick={() => togglePlay(station)} className="p-2 rounded-full hover:bg-black/5 text-theme-primary transition-colors">
          {activeStation?.id === station.id && isPlaying ? <Icons.Pause className="w-6 h-6" /> : <Icons.Play className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );

  const TimerDialog = () => {
    if (!isTimerDialogOpen) return null;
    const durations = [15, 30, 45, 60, 90, 120];
    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsTimerDialogOpen(false)}>
        <div className="bg-theme-surface w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-slide-up sm:animate-none border border-theme-border" onClick={e => e.stopPropagation()}>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4 text-theme-primary">设置睡眠定时器</h3>
            <div className="grid grid-cols-3 gap-3">
              {durations.map(d => (
                <button 
                  key={d} 
                  onClick={() => { setSleepTimer(d); setIsTimerDialogOpen(false); }}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${sleepTimer === d ? 'bg-theme-primary text-theme-surface' : 'bg-theme-container text-theme-onContainer hover:opacity-80'}`}
                >
                  {d} 分钟
                </button>
              ))}
            </div>
            {sleepTimer && (
              <button 
                onClick={() => { setSleepTimer(null); setIsTimerDialogOpen(false); }}
                className="w-full mt-4 py-3 bg-[#F9DEDC] text-[#410E0B] rounded-xl text-sm font-medium"
              >
                取消定时器
              </button>
            )}
            <button 
              onClick={() => setIsTimerDialogOpen(false)}
              className="w-full mt-2 py-3 text-theme-primary font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MiniPlayer = () => {
    if (!activeStation) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-theme-container text-theme-onContainer p-3 flex items-center justify-between z-30 cursor-pointer shadow-lg transition-colors duration-500" onClick={() => setCurrentView('FULL_PLAYER')}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-theme-border rounded-full flex items-center justify-center overflow-hidden">
            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" alt="" /> : <Icons.Radio className="w-5 h-5" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{activeStation.name}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs opacity-70">{isLoading ? '加载中...' : (isPlaying ? '正在播放' : '已暂停')}</span>
              {sleepTimer && (
                <span className="text-[10px] bg-theme-primary text-theme-surface px-1.5 rounded-full font-bold transition-colors">
                  {sleepTimer}m
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <button onClick={() => setIsTimerDialogOpen(true)} className="p-2">
            <Icons.Timer className={`w-6 h-6 transition-colors ${sleepTimer ? 'text-theme-primary' : 'opacity-50'}`} />
          </button>
          <button onClick={() => togglePlay()} className="p-2 bg-theme-primary text-theme-surface rounded-full transition-colors">
            {isPlaying ? <Icons.Pause className="w-6 h-6" /> : <Icons.Play className="w-6 h-6" />}
          </button>
        </div>
      </div>
    );
  };

  const AddStationView = () => {
    const [tab, setTab] = useState<'search' | 'manual' | 'import'>('search');
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [importUrl, setImportUrl] = useState('');
    const [importText, setImportText] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseM3U(text);
        if (parsed.length > 0) {
          addStations(parsed);
        } else {
          alert('未找到有效的 M3U 电台');
        }
      };
      reader.readAsText(file);
    };

    const handleUrlImport = async () => {
      if (!importUrl) return;
      setIsImporting(true);
      try {
        const response = await fetch(importUrl);
        const text = await response.text();
        const parsed = parseM3U(text);
        if (parsed.length > 0) {
          addStations(parsed);
        } else {
          alert('该 URL 未包含有效的 M3U 内容');
        }
      } catch (err) {
        alert('无法获取该 URL。');
      } finally {
        setIsImporting(false);
      }
    };

    const handleTextImport = () => {
      const parsed = parseM3U(importText);
      if (parsed.length > 0) {
        addStations(parsed);
      } else {
        alert('文本中未找到有效的电台信息');
      }
    };

    return (
      <div className="p-4 space-y-6 pb-24">
        <div className="flex bg-theme-container rounded-full p-1 transition-colors">
          <button className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${tab === 'search' ? 'bg-theme-surface shadow-sm text-theme-primary' : 'text-theme-onContainer'}`} onClick={() => setTab('search')}>搜索</button>
          <button className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${tab === 'manual' ? 'bg-theme-surface shadow-sm text-theme-primary' : 'text-theme-onContainer'}`} onClick={() => setTab('manual')}>手动</button>
          <button className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${tab === 'import' ? 'bg-theme-surface shadow-sm text-theme-primary' : 'text-theme-onContainer'}`} onClick={() => setTab('import')}>导入</button>
        </div>

        {tab === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <input type="text" placeholder="搜索电台名称..." className="w-full h-14 bg-theme-container text-theme-primary rounded-xl px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all placeholder:opacity-50" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchStations(searchQuery)} />
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-textSecondary" />
              <button onClick={() => searchStations(searchQuery)} className="absolute right-2 top-2 h-10 px-4 bg-theme-primary text-theme-surface rounded-lg text-sm font-medium transition-colors">搜索</button>
            </div>
            <div className="space-y-2">
              {isSearching ? <p className="text-center py-8 text-theme-textSecondary">正在搜索...</p> : searchResults.map(res => (
                <div key={res.id} className="flex items-center gap-4 p-3 bg-theme-surface rounded-xl shadow-sm border border-theme-border transition-colors">
                  <div className="w-10 h-10 bg-theme-container rounded-lg overflow-hidden flex-shrink-0 transition-colors">
                    <img src={res.iconUrl} className="w-full h-full object-cover" alt="" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-theme-primary">{res.name}</div>
                    <div className="text-xs text-theme-textSecondary truncate">{res.notes}</div>
                  </div>
                  <button onClick={() => { addStation(res); setCurrentView('LIST'); }} className="p-2 text-theme-primary transition-colors"><Icons.Plus className="w-6 h-6" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-textSecondary mb-1">电台名称</label>
              <input type="text" className="w-full h-14 bg-theme-container text-theme-primary rounded-xl px-4 focus:outline-none" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-textSecondary mb-1">流链接 (MP3/AAC)</label>
              <input type="text" className="w-full h-14 bg-theme-container text-theme-primary rounded-xl px-4 focus:outline-none" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-textSecondary mb-1">图标 URL (可选)</label>
              <input type="text" className="w-full h-14 bg-theme-container text-theme-primary rounded-xl px-4 focus:outline-none" value={iconUrl} onChange={e => setIconUrl(e.target.value)} />
            </div>
            <button className="w-full h-14 bg-theme-primary text-theme-surface rounded-full font-medium transition-colors" onClick={() => { addStation({ name, url, iconUrl }); setCurrentView('LIST'); }}>保存电台</button>
          </div>
        )}

        {tab === 'import' && (
          <div className="space-y-6">
            <div className="bg-theme-surface p-4 rounded-2xl shadow-sm border border-theme-border transition-colors space-y-4">
              <div className="flex items-center gap-3 text-theme-primary transition-colors">
                <Icons.File className="w-5 h-5" />
                <h3 className="font-medium">从文件导入 (.m3u)</h3>
              </div>
              <input type="file" accept=".m3u" className="hidden" id="m3u-upload" onChange={handleFileUpload} />
              <label htmlFor="m3u-upload" className="flex items-center justify-center w-full h-14 border-2 border-dashed border-theme-primary/30 rounded-xl cursor-pointer hover:bg-theme-primary/5 transition-colors text-theme-primary">
                选择 M3U 文件
              </label>
            </div>

            <div className="bg-theme-surface p-4 rounded-2xl shadow-sm border border-theme-border transition-colors space-y-4">
              <div className="flex items-center gap-3 text-theme-primary transition-colors">
                <Icons.Globe className="w-5 h-5" />
                <h3 className="font-medium">从 URL 导入</h3>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="输入 M3U 播放列表 URL..." className="flex-1 h-12 bg-theme-container text-theme-primary rounded-lg px-4 focus:outline-none" value={importUrl} onChange={e => setImportUrl(e.target.value)} />
                <button onClick={handleUrlImport} disabled={isImporting} className="h-12 px-6 bg-theme-primary text-theme-surface rounded-lg font-medium disabled:opacity-50 transition-colors">
                  {isImporting ? '获取中...' : '导入'}
                </button>
              </div>
            </div>

            <div className="bg-theme-surface p-4 rounded-2xl shadow-sm border border-theme-border transition-colors space-y-4">
              <div className="flex items-center gap-3 text-theme-primary transition-colors">
                <Icons.Edit className="w-5 h-5" />
                <h3 className="font-medium">手动粘贴 M3U 文本</h3>
              </div>
              <textarea placeholder="#EXTM3U..." className="w-full h-32 bg-theme-container text-theme-primary rounded-xl p-4 focus:outline-none font-mono text-sm" value={importText} onChange={e => setImportText(e.target.value)} />
              <button onClick={handleTextImport} className="w-full h-12 bg-theme-primary text-theme-surface rounded-lg font-medium transition-colors">处理文本并导入</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SettingsView = () => (
    <div className="p-4 space-y-8 pb-24">
      <section>
        <h2 className="text-theme-primary text-sm font-medium mb-4 uppercase tracking-wider transition-colors">外观与主题</h2>
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Icons.Palette className="w-6 h-6 text-theme-textSecondary" />
              <div>
                <p className="font-medium text-theme-primary">主题色调</p>
                <p className="text-sm text-theme-textSecondary">选择应用的主题颜色 (在浅色模式下有效)</p>
              </div>
            </div>
            <div className="flex gap-3 px-1">
              {(Object.keys(THEME_PALETTES) as ThemeColor[]).filter(c => c !== 'black').map((color) => (
                <button
                  key={color}
                  onClick={() => setSettings(p => ({ ...p, themeColor: color }))}
                  className={`w-10 h-10 rounded-full border-4 transition-transform active:scale-90 ${
                    settings.themeColor === color ? 'border-theme-primary' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: THEME_PALETTES[color].primary }}
                  title={color}
                />
              ))}
            </div>
            {isSystemDark && (
              <p className="text-xs text-theme-textSecondary italic">系统已开启深色模式，主题已自动切换为纯黑模式。</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icons.Plus className="w-6 h-6 text-theme-textSecondary" />
              <div><p className="font-medium text-theme-primary">图标样式</p><p className="text-sm text-theme-textSecondary transition-all">{settings.iconStyle === 'circle' ? '圆形' : '方形'}</p></div>
            </div>
            <button onClick={() => setSettings(p => ({...p, iconStyle: p.iconStyle === 'circle' ? 'square' : 'circle'}))} className="px-4 py-2 bg-theme-container text-theme-onContainer rounded-full text-sm font-medium transition-colors">切换</button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-theme-primary text-sm font-medium mb-4 uppercase tracking-wider transition-colors">定时器</h2>
        <div className="bg-theme-surface p-4 rounded-2xl shadow-sm border border-theme-border space-y-4">
          <p className="text-sm font-medium text-theme-textSecondary">到达时间后的操作</p>
          <div className="flex gap-4">
            <button 
                onClick={() => setSettings(p => ({...p, sleepTimerAction: 'pause'}))}
                className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-colors ${settings.sleepTimerAction === 'pause' ? 'bg-theme-container border-theme-primary text-theme-primary' : 'bg-theme-surface border-theme-border text-theme-onContainer'}`}
            >
                暂停播放
            </button>
            <button 
                onClick={() => setSettings(p => ({...p, sleepTimerAction: 'stop'}))}
                className={`flex-1 py-3 rounded-xl border font-medium text-sm transition-colors ${settings.sleepTimerAction === 'stop' ? 'bg-theme-container border-theme-primary text-theme-primary' : 'bg-theme-surface border-theme-border text-theme-onContainer'}`}
            >
                重置播放
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-theme-primary text-sm font-medium mb-4 uppercase tracking-wider transition-colors">数据</h2>
        <div className="space-y-4">
          <button className="w-full p-4 bg-theme-surface border border-theme-border rounded-xl text-left flex items-center gap-4 text-theme-primary" onClick={() => {
            const blob = new Blob([JSON.stringify(stations)], {type: 'application/json'});
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transistor_backup.json'; a.click();
          }}>
            <Icons.Share className="w-6 h-6 text-theme-textSecondary" />
            <div><p className="font-medium">备份</p><p className="text-sm text-theme-textSecondary">导出电台数据</p></div>
          </button>
          <button className="w-full p-4 bg-[#F9DEDC] border border-[#B3261E] rounded-xl text-left flex items-center gap-4 text-[#410E0B]" onClick={() => { if (confirm('确定要清除所有数据吗？')) { localStorage.clear(); window.location.reload(); } }}>
            <Icons.Trash className="w-6 h-6" />
            <div><p className="font-medium">重置</p><p className="text-sm">清除所有本地缓存</p></div>
          </button>
        </div>
      </section>
    </div>
  );

  const FullPlayerView = () => {
    if (!activeStation) return null;
    return (
      <div className="fixed inset-0 bg-[#000000] text-white z-50 flex flex-col p-6 animate-slide-up overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setCurrentView('LIST')} className="p-2"><Icons.ChevronLeft className="w-6 h-6" /></button>
          <div className="text-center">
            <h2 className="text-lg font-medium">{activeStation.name}</h2>
            <p className="text-sm text-white/70">{isLoading ? '加载中...' : (isPlaying ? '正在播放' : '已暂停')}</p>
          </div>
          <button onClick={() => deleteStation(activeStation.id)} className="p-2 text-[#F2B8B5]"><Icons.Trash className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          <div className={`relative w-64 h-64 bg-[#1C1B1F] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 border border-white/10 ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-3xl'}`}>
            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" alt="" /> : <Icons.Radio className="w-24 h-24 text-white/20" />}
            {isLoading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-4">
             <button onClick={() => togglePlay()} className="w-20 h-20 bg-theme-primary text-theme-surface rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform">
               {isPlaying ? <Icons.Pause className="w-10 h-10" /> : <Icons.Play className="w-10 h-10 ml-1" />}
             </button>
             {sleepTimer && (
                <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                    <Icons.Timer className="w-4 h-4 text-theme-primary transition-colors" />
                    <span className="text-sm font-medium text-theme-primary transition-colors">{sleepTimer} 分钟后停止</span>
                </div>
             )}
          </div>

          <div className="w-full max-w-sm flex items-center gap-4">
            <Icons.Volume2 className="w-6 h-6 text-white/70" />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="flex-1 accent-theme-primary h-1.5 rounded-full appearance-none bg-white/20 transition-all" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-auto pt-8">
          <button onClick={() => setIsTimerDialogOpen(true)} className="flex flex-col items-center gap-1 p-2">
            <Icons.Timer className={`w-6 h-6 transition-colors ${sleepTimer ? 'text-theme-primary' : 'text-white/70'}`} />
            <span className="text-[10px] uppercase font-medium tracking-widest transition-colors">{sleepTimer ? `${sleepTimer}m` : '定时'}</span>
          </button>
          <button onClick={() => toggleFavorite(activeStation.id)} className="flex flex-col items-center gap-1 p-2">
            <Icons.Star className={`w-6 h-6 transition-colors ${activeStation.isFavorite ? 'text-theme-primary' : 'text-white/70'}`} active={activeStation.isFavorite} />
            <span className="text-[10px] uppercase font-medium tracking-widest transition-colors">收藏</span>
          </button>
          <button onClick={() => {
              if (navigator.share) {
                navigator.share({ title: activeStation.name, url: activeStation.url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(activeStation.url);
                alert('链接已复制到剪贴板');
              }
            }} 
            className="flex flex-col items-center gap-1 p-2"
          >
            <Icons.Share className="w-6 h-6 text-white/70" />
            <span className="text-[10px] uppercase font-medium tracking-widest">分享</span>
          </button>
          <button onClick={() => {}} className="flex flex-col items-center gap-1 p-2 opacity-50 cursor-not-allowed">
            <Icons.Edit className="w-6 h-6 text-white/70" />
            <span className="text-[10px] uppercase font-medium tracking-widest">编辑</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto flex flex-col bg-theme-surface transition-colors duration-500">
      <style>{`
        :root {
          --theme-primary: ${activePalette.primary};
          --theme-container: ${activePalette.container};
          --theme-on-container: ${activePalette.onContainer};
          --theme-active: ${activePalette.active};
          --theme-surface: ${activePalette.surface};
          --theme-border: ${activePalette.border};
          --theme-text-secondary: ${activePalette.textSecondary};
        }
        body { background-color: var(--theme-surface); transition: background-color 0.5s ease; }
        .text-theme-primary { color: var(--theme-primary); }
        .bg-theme-primary { background-color: var(--theme-primary); }
        .bg-theme-container { background-color: var(--theme-container); }
        .text-theme-onContainer { color: var(--theme-on-container); }
        .bg-theme-onContainer { background-color: var(--theme-on-container); }
        .text-theme-active { color: var(--theme-active); }
        .bg-theme-active { background-color: var(--theme-active); }
        .bg-theme-surface { background-color: var(--theme-surface); }
        .border-theme-border { border-color: var(--theme-border); }
        .text-theme-textSecondary { color: var(--theme-text-secondary); }
        .accent-theme-active { accent-color: var(--theme-active); }
        .accent-theme-primary { accent-color: var(--theme-primary); }
        .focus\\:ring-theme-primary:focus { --tw-ring-color: var(--theme-primary); }
      `}</style>
      <Header />
      <main className="flex-1 overflow-y-auto">
        {currentView === 'LIST' && (
          <div className="pb-24">
            {stations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center space-y-4">
                <div className="w-24 h-24 bg-theme-container rounded-full flex items-center justify-center transition-colors duration-500"><Icons.Radio className="w-12 h-12 text-theme-textSecondary" /></div>
                <p className="text-theme-textSecondary">尚未添加电台，快去添加吧！</p>
                <button onClick={() => setCurrentView('ADD')} className="bg-theme-primary text-theme-surface px-8 py-3 rounded-full font-medium transition-colors">添加新电台</button>
              </div>
            ) : (
              <div className="divide-y divide-theme-border transition-all duration-500">
                {sortedStations.map(s => <StationCard key={s.id} station={s} />)}
              </div>
            )}
          </div>
        )}
        {currentView === 'ADD' && <AddStationView />}
        {currentView === 'SETTINGS' && <SettingsView />}
      </main>
      {currentView === 'FULL_PLAYER' && <FullPlayerView />}
      <MiniPlayer />
      <TimerDialog />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
