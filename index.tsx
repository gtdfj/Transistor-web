
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

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  showStreamUrl: boolean;
  iconStyle: 'circle' | 'square';
  sleepTimerAction: 'pause' | 'close';
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
      <line x1="5" y1="12" x2="19" y2="12" />
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

// --- App Component ---
const App: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('LIST');
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'system',
    showStreamUrl: true,
    iconStyle: 'circle',
    sleepTimerAction: 'pause',
    resumePlayback: 'never',
    networkType: 'any'
  });
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [isMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerRef = useRef<number | null>(null);

  // Persistence
  useEffect(() => {
    const savedStations = localStorage.getItem('transistor_stations');
    if (savedStations) setStations(JSON.parse(savedStations));
    const savedSettings = localStorage.getItem('transistor_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('transistor_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('transistor_settings', JSON.stringify(settings));
  }, [settings]);

  // Audio Logic
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

    const audio = audioRef.current;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = (e: any) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, [volume, isMuted]);

  const togglePlay = useCallback((station?: Station) => {
    if (!audioRef.current) return;
    if (station) {
      if (activeStation?.id === station.id && isPlaying) {
        audioRef.current.pause();
      } else {
        setActiveStation(station);
        audioRef.current.src = station.url;
        audioRef.current.play().catch(console.error);
      }
    } else if (activeStation) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [activeStation, isPlaying]);

  // Sleep Timer
  useEffect(() => {
    if (sleepTimer !== null && sleepTimer > 0) {
      sleepTimerRef.current = window.setInterval(() => {
        setSleepTimer(prev => {
          if (prev && prev > 1) return prev - 1;
          if (isPlaying && audioRef.current) audioRef.current.pause();
          return null;
        });
      }, 60000);
    } else {
      if (sleepTimerRef.current) window.clearInterval(sleepTimerRef.current);
    }
    return () => {
      if (sleepTimerRef.current) window.clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimer, isPlaying]);

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

  // --- Sub-components ---
  const Header = () => (
    <div className="sticky top-0 z-20 flex items-center justify-between px-4 h-16 bg-[#F7F2FA] border-b border-[#E7E0EC]">
      <div className="flex items-center gap-4">
        {currentView !== 'LIST' && (
          <button onClick={() => setCurrentView('LIST')} className="p-2 rounded-full hover:bg-black/5">
            <Icons.ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-medium tracking-tight">
          {currentView === 'LIST' ? 'Transistor' : 
           currentView === 'ADD' ? '添加电台' : 
           currentView === 'SETTINGS' ? '设置' : '正在播放'}
        </h1>
      </div>
      <div className="flex items-center gap-1">
        {currentView === 'LIST' && (
          <>
            <button onClick={() => setCurrentView('ADD')} className="p-3 rounded-full hover:bg-black/5">
              <Icons.Plus className="w-6 h-6" />
            </button>
            <button onClick={() => setCurrentView('SETTINGS')} className="p-3 rounded-full hover:bg-black/5">
              <Icons.Settings className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const StationCard: React.FC<{ station: Station }> = ({ station }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-black/5 group transition-colors cursor-pointer" onClick={() => togglePlay(station)}>
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#EADDFF] text-[#21005D] overflow-hidden ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-lg'}`}>
        {station.iconUrl ? (
          <img src={station.iconUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <Icons.Radio className="w-6 h-6" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium truncate">{station.name}</h3>
        {settings.showStreamUrl && <p className="text-sm text-[#49454F] truncate">{station.url}</p>}
      </div>
      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
        <button onClick={() => toggleFavorite(station.id)} className={`p-2 rounded-full hover:bg-black/5 ${station.isFavorite ? 'text-[#6750A4]' : 'text-[#49454F]'}`}>
          <Icons.Star className="w-5 h-5" active={station.isFavorite} />
        </button>
        <button onClick={() => togglePlay(station)} className="p-2 rounded-full hover:bg-black/5 text-[#6750A4]">
          {activeStation?.id === station.id && isPlaying ? <Icons.Pause className="w-6 h-6" /> : <Icons.Play className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );

  const MiniPlayer = () => {
    if (!activeStation) return null;
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-[#211F26] text-white p-3 flex items-center justify-between z-30 cursor-pointer shadow-lg" onClick={() => setCurrentView('FULL_PLAYER')}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-[#49454F] rounded-full flex items-center justify-center overflow-hidden">
            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" alt="" /> : <Icons.Radio className="w-5 h-5" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{activeStation.name}</span>
            <span className="text-xs text-white/70">{isPlaying ? '正在播放' : '已暂停'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <button onClick={() => setSleepTimer(prev => prev ? null : 30)} className="p-2">
            <Icons.Timer className={`w-6 h-6 ${sleepTimer ? 'text-[#D0BCFF]' : 'text-white/70'}`} />
          </button>
          <button onClick={() => togglePlay()} className="p-2 bg-[#D0BCFF] text-[#381E72] rounded-full">
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
        alert('无法获取该 URL。请检查 URL 或尝试手动粘贴。');
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
        <div className="flex bg-[#E7E0EC] rounded-full p-1">
          <button className={`flex-1 py-2 rounded-full text-sm font-medium ${tab === 'search' ? 'bg-white shadow-sm' : ''}`} onClick={() => setTab('search')}>搜索</button>
          <button className={`flex-1 py-2 rounded-full text-sm font-medium ${tab === 'manual' ? 'bg-white shadow-sm' : ''}`} onClick={() => setTab('manual')}>手动</button>
          <button className={`flex-1 py-2 rounded-full text-sm font-medium ${tab === 'import' ? 'bg-white shadow-sm' : ''}`} onClick={() => setTab('import')}>导入</button>
        </div>

        {tab === 'search' && (
          <div className="space-y-4">
            <div className="relative">
              <input type="text" placeholder="搜索电台名称..." className="w-full h-14 bg-[#ECE6F0] rounded-xl px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#6750A4]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchStations(searchQuery)} />
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49454F]" />
              <button onClick={() => searchStations(searchQuery)} className="absolute right-2 top-2 h-10 px-4 bg-[#6750A4] text-white rounded-lg text-sm font-medium">搜索</button>
            </div>
            <div className="space-y-2">
              {isSearching ? <p className="text-center py-8 text-[#49454F]">正在搜索...</p> : searchResults.map(res => (
                <div key={res.id} className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-[#E7E0EC]">
                  <div className="w-10 h-10 bg-[#EADDFF] rounded-lg overflow-hidden flex-shrink-0">
                    <img src={res.iconUrl} className="w-full h-full object-cover" alt="" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{res.name}</div>
                    <div className="text-xs text-[#49454F] truncate">{res.notes}</div>
                  </div>
                  <button onClick={() => { addStation(res); setCurrentView('LIST'); }} className="p-2 text-[#6750A4]"><Icons.Plus className="w-6 h-6" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#49454F] mb-1">电台名称</label>
              <input type="text" className="w-full h-14 bg-[#ECE6F0] rounded-xl px-4 focus:outline-none" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#49454F] mb-1">流链接</label>
              <input type="text" className="w-full h-14 bg-[#ECE6F0] rounded-xl px-4 focus:outline-none" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#49454F] mb-1">图标 URL (可选)</label>
              <input type="text" className="w-full h-14 bg-[#ECE6F0] rounded-xl px-4 focus:outline-none" value={iconUrl} onChange={e => setIconUrl(e.target.value)} />
            </div>
            <button className="w-full h-14 bg-[#6750A4] text-white rounded-full font-medium" onClick={() => { addStation({ name, url, iconUrl }); setCurrentView('LIST'); }}>保存电台</button>
          </div>
        )}

        {tab === 'import' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7E0EC] space-y-4">
              <div className="flex items-center gap-3 text-[#6750A4]">
                <Icons.File className="w-5 h-5" />
                <h3 className="font-medium">从文件导入 (.m3u)</h3>
              </div>
              <input type="file" accept=".m3u" className="hidden" id="m3u-upload" onChange={handleFileUpload} />
              <label htmlFor="m3u-upload" className="flex items-center justify-center w-full h-14 border-2 border-dashed border-[#6750A4]/30 rounded-xl cursor-pointer hover:bg-[#6750A4]/5 transition-colors text-[#6750A4]">
                选择 M3U 文件
              </label>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7E0EC] space-y-4">
              <div className="flex items-center gap-3 text-[#6750A4]">
                <Icons.Globe className="w-5 h-5" />
                <h3 className="font-medium">从 URL 导入</h3>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="输入 M3U 播放列表 URL..." className="flex-1 h-12 bg-[#ECE6F0] rounded-lg px-4 focus:outline-none" value={importUrl} onChange={e => setImportUrl(e.target.value)} />
                <button onClick={handleUrlImport} disabled={isImporting} className="h-12 px-6 bg-[#6750A4] text-white rounded-lg font-medium disabled:opacity-50">
                  {isImporting ? '获取中...' : '导入'}
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7E0EC] space-y-4">
              <div className="flex items-center gap-3 text-[#6750A4]">
                <Icons.Edit className="w-5 h-5" />
                <h3 className="font-medium">手动粘贴 M3U 文本</h3>
              </div>
              <textarea placeholder="#EXTM3U..." className="w-full h-32 bg-[#ECE6F0] rounded-xl p-4 focus:outline-none font-mono text-sm" value={importText} onChange={e => setImportText(e.target.value)} />
              <button onClick={handleTextImport} className="w-full h-12 bg-[#6750A4] text-white rounded-lg font-medium">处理文本并导入</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SettingsView = () => (
    <div className="p-4 space-y-8 pb-24">
      <section>
        <h2 className="text-[#6750A4] text-sm font-medium mb-4 uppercase tracking-wider">外观</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icons.Plus className="w-6 h-6 text-[#49454F]" />
              <div><p className="font-medium">图标样式</p><p className="text-sm text-[#49454F]">{settings.iconStyle === 'circle' ? '圆形' : '方形'}</p></div>
            </div>
            <button onClick={() => setSettings(p => ({...p, iconStyle: p.iconStyle === 'circle' ? 'square' : 'circle'}))} className="px-4 py-2 bg-[#EADDFF] text-[#21005D] rounded-full text-sm font-medium">切换</button>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-[#6750A4] text-sm font-medium mb-4 uppercase tracking-wider">数据</h2>
        <div className="space-y-4">
          <button className="w-full p-4 bg-white border border-[#E7E0EC] rounded-xl text-left flex items-center gap-4" onClick={() => {
            const blob = new Blob([JSON.stringify(stations)], {type: 'application/json'});
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transistor_backup.json'; a.click();
          }}>
            <Icons.Share className="w-6 h-6 text-[#49454F]" />
            <div><p className="font-medium">备份</p><p className="text-sm text-[#49454F]">导出电台数据</p></div>
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
      <div className="fixed inset-0 bg-[#211F26] text-white z-50 flex flex-col p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setCurrentView('LIST')} className="p-2"><Icons.ChevronLeft className="w-6 h-6" /></button>
          <div className="text-center">
            <h2 className="text-lg font-medium">{activeStation.name}</h2>
            <p className="text-sm text-white/70">{isPlaying ? '正在播放' : '已暂停'}</p>
          </div>
          <button onClick={() => deleteStation(activeStation.id)} className="p-2 text-[#F2B8B5]"><Icons.Trash className="w-6 h-6" /></button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          <div className={`w-64 h-64 bg-[#49454F] shadow-2xl flex items-center justify-center overflow-hidden ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-3xl'}`}>
            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" alt="" /> : <Icons.Radio className="w-24 h-24 text-white/20" />}
          </div>
          <button onClick={() => togglePlay()} className="w-20 h-20 bg-[#D0BCFF] text-[#381E72] rounded-full flex items-center justify-center shadow-xl">
            {isPlaying ? <Icons.Pause className="w-10 h-10" /> : <Icons.Play className="w-10 h-10 ml-1" />}
          </button>
          <div className="w-full max-w-sm flex items-center gap-4">
            <Icons.Volume2 className="w-6 h-6 text-white/70" />
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="flex-1 accent-[#D0BCFF] h-1.5 rounded-full appearance-none bg-white/20" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-auto">
          <button onClick={() => setSleepTimer(prev => prev ? null : 30)} className="flex flex-col items-center gap-1 p-2">
            <Icons.Timer className={`w-6 h-6 ${sleepTimer ? 'text-[#D0BCFF]' : 'text-white/70'}`} />
            <span className="text-[10px] uppercase font-medium tracking-widest">{sleepTimer ? `${sleepTimer}m` : '定时'}</span>
          </button>
          <button onClick={() => toggleFavorite(activeStation.id)} className="flex flex-col items-center gap-1 p-2">
            <Icons.Star className={`w-6 h-6 ${activeStation.isFavorite ? 'text-[#D0BCFF]' : 'text-white/70'}`} active={activeStation.isFavorite} />
            <span className="text-[10px] uppercase font-medium tracking-widest">收藏</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen max-w-2xl mx-auto flex flex-col bg-[#F7F2FA]">
      <Header />
      <main className="flex-1 overflow-y-auto">
        {currentView === 'LIST' && (
          <div className="pb-24">
            {stations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center space-y-4">
                <div className="w-24 h-24 bg-[#E7E0EC] rounded-full flex items-center justify-center"><Icons.Radio className="w-12 h-12 text-[#49454F]" /></div>
                <p className="text-[#49454F]">尚未添加电台，快去添加吧！</p>
                <button onClick={() => setCurrentView('ADD')} className="bg-[#6750A4] text-white px-8 py-3 rounded-full font-medium">添加新电台</button>
              </div>
            ) : (
              <div className="divide-y divide-[#E7E0EC]">
                {stations.map(s => <StationCard key={s.id} station={s} />)}
              </div>
            )}
          </div>
        )}
        {currentView === 'ADD' && <AddStationView />}
        {currentView === 'SETTINGS' && <SettingsView />}
      </main>
      {currentView === 'FULL_PLAYER' && <FullPlayerView />}
      <MiniPlayer />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
