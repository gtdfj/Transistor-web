
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Station, ViewState, AppSettings, RadioBrowserStation } from './types';
import { Icons, COLORS } from './constants';

const App: React.FC = () => {
  // State
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
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Fix: Use number for browser-based setInterval return value to avoid NodeJS namespace error
  const sleepTimerRef = useRef<number | null>(null);

  // Persistence
  useEffect(() => {
    const savedStations = localStorage.getItem('transistor_stations');
    if (savedStations) {
      setStations(JSON.parse(savedStations));
    }
    const savedSettings = localStorage.getItem('transistor_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
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
    }
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

  // Sleep Timer Logic
  useEffect(() => {
    if (sleepTimer !== null && sleepTimer > 0) {
      // Fix: Use window.setInterval to ensure the returned ID is treated as a number
      sleepTimerRef.current = window.setInterval(() => {
        setSleepTimer(prev => {
          if (prev && prev > 1) return prev - 1;
          
          // Timer finished
          if (isPlaying && audioRef.current) {
            audioRef.current.pause();
          }
          if (settings.sleepTimerAction === 'close') {
            // Can't really "close" a web tab easily, but we can stop everything
            setActiveStation(null);
            setIsPlaying(false);
          }
          return null;
        });
      }, 60000); // 1 minute
    } else {
      if (sleepTimerRef.current) window.clearInterval(sleepTimerRef.current);
    }

    return () => {
      if (sleepTimerRef.current) window.clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimer, isPlaying, settings.sleepTimerAction]);

  // Station Handlers
  const addStation = (station: Partial<Station>) => {
    const newStation: Station = {
      id: crypto.randomUUID(),
      name: station.name || 'Unknown Station',
      url: station.url || '',
      iconUrl: station.iconUrl,
      notes: station.notes,
      isFavorite: false,
      addedAt: Date.now(),
    };
    setStations(prev => [...prev, newStation]);
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
      const mapped = data.map(s => ({
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

  // Rendering Components
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
           currentView === 'ADD' ? '添加新电台' : 
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

  // Fix: Explicitly type StationCard as React.FC to allow 'key' prop in JSX usage
  const StationCard: React.FC<{ station: Station }> = ({ station }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-black/5 group transition-colors">
      <div 
        className={`flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#EADDFF] text-[#21005D] ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
        onClick={() => togglePlay(station)}
      >
        {station.iconUrl ? (
          <img src={station.iconUrl} alt="" className="w-full h-full object-cover rounded-inherit" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : (
          <Icons.Radio className="w-6 h-6" />
        )}
      </div>
      <div className="flex-1 min-w-0" onClick={() => togglePlay(station)}>
        <h3 className="text-base font-medium truncate">{station.name}</h3>
        {settings.showStreamUrl && (
          <p className="text-sm text-[#49454F] truncate">{station.url}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={() => toggleFavorite(station.id)}
          className={`p-2 rounded-full hover:bg-black/5 ${station.isFavorite ? 'text-[#6750A4]' : 'text-[#49454F]'}`}
        >
          <Icons.Star className="w-5 h-5" active={station.isFavorite} />
        </button>
        <button 
          onClick={() => togglePlay(station)}
          className="p-2 rounded-full hover:bg-black/5 text-[#6750A4]"
        >
          {activeStation?.id === station.id && isPlaying ? (
            <Icons.Pause className="w-6 h-6" />
          ) : (
            <Icons.Play className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );

  const MiniPlayer = () => {
    if (!activeStation) return null;
    return (
      <div 
        className="fixed bottom-0 left-0 right-0 bg-[#211F26] text-white p-3 flex items-center justify-between z-30 cursor-pointer shadow-lg"
        onClick={() => setCurrentView('FULL_PLAYER')}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-[#49454F] rounded-full flex items-center justify-center overflow-hidden">
            {activeStation.iconUrl ? (
              <img src={activeStation.iconUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Icons.Radio className="w-5 h-5" />
            )}
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
    const [tab, setTab] = useState<'search' | 'manual'>('search');
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [iconUrl, setIconUrl] = useState('');

    return (
      <div className="p-4 space-y-6 pb-24">
        <div className="flex bg-[#E7E0EC] rounded-full p-1">
          <button 
            className={`flex-1 py-2 rounded-full text-sm font-medium ${tab === 'search' ? 'bg-[#FFFFFF] shadow-sm' : ''}`}
            onClick={() => setTab('search')}
          >
            搜索
          </button>
          <button 
            className={`flex-1 py-2 rounded-full text-sm font-medium ${tab === 'manual' ? 'bg-[#FFFFFF] shadow-sm' : ''}`}
            onClick={() => setTab('manual')}
          >
            手动
          </button>
        </div>

        {tab === 'search' ? (
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索电台名称..." 
                className="w-full h-14 bg-[#ECE6F0] rounded-xl px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchStations(searchQuery)}
              />
              <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#49454F]" />
              <button 
                onClick={() => searchStations(searchQuery)}
                className="absolute right-2 top-2 h-10 px-4 bg-[#6750A4] text-white rounded-lg text-sm font-medium"
              >
                搜索
              </button>
            </div>
            
            <div className="space-y-2">
              {isSearching ? (
                <p className="text-center py-8 text-[#49454F]">正在搜索...</p>
              ) : searchResults.map(res => (
                <div key={res.id} className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-[#E7E0EC]">
                  <div className="w-10 h-10 bg-[#EADDFF] rounded-lg overflow-hidden flex-shrink-0">
                    <img src={res.iconUrl} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = ''} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{res.name}</div>
                    <div className="text-xs text-[#49454F] truncate">{res.notes}</div>
                  </div>
                  <button 
                    onClick={() => addStation(res)}
                    className="p-2 text-[#6750A4]"
                  >
                    <Icons.Plus className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#49454F] mb-1">电台名称</label>
              <input 
                type="text" 
                className="w-full h-14 bg-[#ECE6F0] rounded-xl px-4 focus:outline-none" 
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#49454F] mb-1">流媒体 URL</label>
              <input 
                type="text" 
                className="w-full h-14 bg-[#ECE6F0] rounded-xl px-4 focus:outline-none" 
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#49454F] mb-1">图标 URL (可选)</label>
              <input 
                type="text" 
                className="w-full h-14 bg-[#ECE6F0] rounded-xl px-4 focus:outline-none" 
                value={iconUrl}
                onChange={e => setIconUrl(e.target.value)}
              />
            </div>
            <button 
              className="w-full h-14 bg-[#6750A4] text-white rounded-full font-medium"
              onClick={() => addStation({ name, url, iconUrl })}
            >
              保存电台
            </button>
          </div>
        )}
      </div>
    );
  };

  const SettingsView = () => (
    <div className="p-4 space-y-8 pb-24">
      <section>
        <h2 className="text-[#6750A4] text-sm font-medium mb-4 uppercase tracking-wider">常规</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icons.Plus className="w-6 h-6 text-[#49454F]" />
              <div>
                <p className="font-medium">图标样式</p>
                <p className="text-sm text-[#49454F]">当前: {settings.iconStyle === 'circle' ? '圆形' : '方形'}</p>
              </div>
            </div>
            <button 
              onClick={() => setSettings(p => ({...p, iconStyle: p.iconStyle === 'circle' ? 'square' : 'circle'}))}
              className="px-4 py-2 bg-[#EADDFF] text-[#21005D] rounded-full text-sm font-medium"
            >
              切换
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icons.Radio className="w-6 h-6 text-[#49454F]" />
              <div>
                <p className="font-medium">显示流链接</p>
                <p className="text-sm text-[#49454F]">在列表中显示 URL</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.showStreamUrl}
              onChange={() => setSettings(p => ({...p, showStreamUrl: !p.showStreamUrl}))}
              className="w-12 h-6 appearance-none bg-[#ECE6F0] rounded-full checked:bg-[#6750A4] relative transition-colors cursor-pointer before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-6"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[#6750A4] text-sm font-medium mb-4 uppercase tracking-wider">存储</h2>
        <div className="space-y-4">
          <button 
            className="w-full p-4 bg-white border border-[#E7E0EC] rounded-xl text-left flex items-center gap-4"
            onClick={() => {
              const data = JSON.stringify(stations);
              const blob = new Blob([data], {type: 'application/json'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'transistor_backup.json';
              a.click();
            }}
          >
            <Icons.Share className="w-6 h-6 text-[#49454F]" />
            <div>
              <p className="font-medium">备份电台</p>
              <p className="text-sm text-[#49454F]">导出所有电台数据</p>
            </div>
          </button>
          <button 
            className="w-full p-4 bg-white border border-[#E7E0EC] rounded-xl text-left flex items-center gap-4"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.onchange = (e: any) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (re) => {
                  try {
                    const imported = JSON.parse(re.target?.result as string);
                    setStations(imported);
                  } catch(e) { alert('Invalid file format'); }
                };
                reader.readAsText(file);
              };
              input.click();
            }}
          >
            <Icons.Plus className="w-6 h-6 text-[#49454F]" />
            <div>
              <p className="font-medium">恢复电台</p>
              <p className="text-sm text-[#49454F]">从 JSON 文件导入</p>
            </div>
          </button>
          <button 
            className="w-full p-4 bg-[#F9DEDC] border border-[#B3261E] rounded-xl text-left flex items-center gap-4 text-[#410E0B]"
            onClick={() => {
              if (confirm('确定要清除所有电台和设置吗？')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
          >
            <Icons.Trash className="w-6 h-6" />
            <div>
              <p className="font-medium">重置应用</p>
              <p className="text-sm">清除所有本地缓存</p>
            </div>
          </button>
        </div>
      </section>

      <section className="text-center pt-4">
        <p className="text-sm text-[#49454F]">程序版本</p>
        <p className="text-base font-medium">Transistor Web v4.2.6</p>
        <p className="text-xs text-[#49454F] mt-1">"Ashes to Ashes"</p>
      </section>
    </div>
  );

  const FullPlayerView = () => {
    if (!activeStation) return null;
    return (
      <div className="fixed inset-0 bg-[#211F26] text-white z-50 flex flex-col p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setCurrentView('LIST')} className="p-2">
            <Icons.ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-medium">{activeStation.name}</h2>
            <p className="text-sm text-white/70">{isPlaying ? '正在播放' : '已暂停'}</p>
          </div>
          <button onClick={() => deleteStation(activeStation.id)} className="p-2 text-[#F2B8B5]">
            <Icons.Trash className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          <div className={`w-64 h-64 bg-[#49454F] shadow-2xl flex items-center justify-center overflow-hidden ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-3xl'}`}>
            {activeStation.iconUrl ? (
              <img src={activeStation.iconUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Icons.Radio className="w-24 h-24 text-white/20" />
            )}
          </div>

          <div className="w-full max-w-xs flex items-center justify-center gap-8">
            <button onClick={() => togglePlay()} className="w-20 h-20 bg-[#D0BCFF] text-[#381E72] rounded-full flex items-center justify-center shadow-xl">
              {isPlaying ? <Icons.Pause className="w-10 h-10" /> : <Icons.Play className="w-10 h-10 ml-1" />}
            </button>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="flex items-center gap-4">
              <Icons.Volume2 className="w-6 h-6 text-white/70" />
              <input 
                type="range" 
                min="0" max="1" step="0.01" 
                value={volume} 
                onChange={e => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-[#D0BCFF] h-1.5 rounded-full appearance-none bg-white/20"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-auto">
          <button onClick={() => setSleepTimer(prev => prev ? null : 30)} className="flex flex-col items-center gap-1 p-2">
            <Icons.Timer className={`w-6 h-6 ${sleepTimer ? 'text-[#D0BCFF]' : 'text-white/70'}`} />
            <span className="text-[10px] uppercase font-medium tracking-widest">{sleepTimer ? `${sleepTimer}m` : '定时'}</span>
          </button>
          <button onClick={() => setCurrentView('ADD')} className="flex flex-col items-center gap-1 p-2">
            <Icons.Edit className="w-6 h-6 text-white/70" />
            <span className="text-[10px] uppercase font-medium tracking-widest">编辑</span>
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: activeStation.name, url: activeStation.url });
              } else {
                navigator.clipboard.writeText(activeStation.url);
                alert('URL copied to clipboard');
              }
            }} 
            className="flex flex-col items-center gap-1 p-2"
          >
            <Icons.Share className="w-6 h-6 text-white/70" />
            <span className="text-[10px] uppercase font-medium tracking-widest">分享</span>
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
            <div className="px-4 py-4 flex gap-2 overflow-x-auto no-scrollbar">
              <button className="px-4 py-2 bg-[#EADDFF] text-[#21005D] rounded-full text-sm font-medium whitespace-nowrap">全部电台</button>
              <button className="px-4 py-2 bg-[#ECE6F0] text-[#49454F] rounded-full text-sm font-medium whitespace-nowrap">我的收藏</button>
              <button className="px-4 py-2 bg-[#ECE6F0] text-[#49454F] rounded-full text-sm font-medium whitespace-nowrap">最近播放</button>
            </div>
            
            {stations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center space-y-4">
                <div className="w-24 h-24 bg-[#E7E0EC] rounded-full flex items-center justify-center">
                   <Icons.Radio className="w-12 h-12 text-[#49454F]" />
                </div>
                <p className="text-[#49454F]">尚未添加电台，快去添加吧！</p>
                <button 
                  onClick={() => setCurrentView('ADD')}
                  className="bg-[#6750A4] text-white px-8 py-3 rounded-full font-medium"
                >
                  添加新电台
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#E7E0EC]">
                {stations.map(station => (
                  <StationCard key={station.id} station={station} />
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === 'ADD' && <AddStationView />}
        {currentView === 'SETTINGS' && <SettingsView />}
      </main>

      {currentView === 'FULL_PLAYER' && <FullPlayerView />}
      <MiniPlayer />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
