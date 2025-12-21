import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// --- Constants & Palettes ---
const THEME_PALETTES = {
    purple: { primary: '#6750A4', container: '#FFFFFF', onContainer: '#21005D', surface: '#F7F2FA', border: '#E7E0EC', textSecondary: '#49454F', active: '#6750A4' },
    blue: { primary: '#0061A4', container: '#FFFFFF', onContainer: '#001D36', surface: '#F8FBFF', border: '#D1E4FF', textSecondary: '#49454F', active: '#0061A4' },
    green: { primary: '#006D32', container: '#FFFFFF', onContainer: '#00210A', surface: '#F7FFF7', border: '#C0EED2', textSecondary: '#49454F', active: '#006D32' },
    red: { primary: '#BA1A1A', container: '#FFFFFF', onContainer: '#410002', surface: '#FFF8F7', border: '#FFDAD6', textSecondary: '#49454F', active: '#BA1A1A' },
    orange: { primary: '#8B5000', container: '#FFFFFF', onContainer: '#2C1600', surface: '#FFF8F2', border: '#FFDDB3', textSecondary: '#49454F', active: '#8B5000' },
    black: { primary: '#FFFFFF', container: '#121212', onContainer: '#E6E1E5', surface: '#000000', border: '#2C2C2E', textSecondary: '#A1A1AA', active: '#0A84FF' },
};

const Icons = {
    Radio: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.48" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            <path d="M7.76 16.24a6 6 0 0 1 0-8.48" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
        </svg>
    ),
    Plus: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    Settings: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
    Play: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z" /></svg>,
    Pause: (props: any) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>,
    Star: (props: any) => (
        <svg viewBox="0 0 24 24" fill={props.active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    Search: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    ChevronLeft: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6" /></svg>,
    Timer: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    Trash: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    ),
    Volume2: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
    ),
    Download: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    Upload: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
    Shield: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    X: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )
};

const parseM3U = (content: string) => {
    const stations: any[] = [];
    const lines = content.split(/\r?\n/);
    let currentMeta: any = {};
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith('#EXTINF:')) {
            const commaIndex = trimmed.lastIndexOf(',');
            let name = commaIndex !== -1 ? trimmed.substring(commaIndex + 1).trim() : '';
            const logoMatch = trimmed.match(/(?:tvg-logo|logo)="([^"]+)"/i);
            currentMeta = { name, iconUrl: logoMatch ? logoMatch[1] : null };
        } else if (!trimmed.startsWith('#')) {
            stations.push({
                name: currentMeta.name || trimmed.split('/').pop()?.split('?')[0] || '未知电台',
                url: trimmed,
                iconUrl: currentMeta.iconUrl || null,
                addedAt: Date.now(),
                isFavorite: false
            });
            currentMeta = {};
        }
    }
    return stations;
};

// --- Safe localStorage wrapper ---
const safeStorage = {
    getItem: (key: string) => {
        try { return localStorage.getItem(key); }
        catch (e) { console.error("Storage access failed:", e); return null; }
    },
    setItem: (key: string, value: string) => {
        try { localStorage.setItem(key, value); }
        catch (e) { console.error("Storage write failed:", e); }
    }
};

const StationItem = ({ station, isActive, isPlaying, iconStyle, palette, onPlay, onToggleFavorite, onDelete }: any) => {
    const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const isVerticalScroll = useRef(false);
    const threshold = 140;

    const handleTouchStart = (e: any) => {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
        setIsSwiping(true);
        isVerticalScroll.current = false;
    };

    const handleTouchMove = (e: any) => {
        if (isVerticalScroll.current) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startX.current;
        const diffY = currentY - startY.current;
        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
            isVerticalScroll.current = true;
            setOffsetX(0);
            return;
        }
        if (Math.abs(diffX) > 5) {
            setOffsetX(diffX);
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        if (isVerticalScroll.current) return;
        if (offsetX < -threshold) {
            if (navigator.vibrate) navigator.vibrate(20);
            onDelete(station);
        } else if (offsetX > threshold) {
            if (navigator.vibrate) navigator.vibrate(20);
            onToggleFavorite(station);
            setOffsetX(0);
        } else {
            setOffsetX(0);
        }
    };

    const opacityAction = Math.min(Math.abs(offsetX) / threshold, 1);

    return (
        <div className="relative overflow-hidden" style={{ backgroundColor: palette.surface }}>
            <div className="absolute inset-0 bg-[#BA1A1A] flex items-center justify-end px-8 transition-opacity" style={{ opacity: offsetX < 0 ? opacityAction : 0 }}>
                <div className="flex flex-col items-center gap-1 text-white">
                    <Icons.Trash className="w-8 h-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest">释放删除</span>
                </div>
            </div>
            <div className="absolute inset-0 bg-yellow-500 flex items-center justify-start px-8 transition-opacity" style={{ opacity: offsetX > 0 ? opacityAction : 0 }}>
                <div className="flex flex-col items-center gap-1 text-white">
                    <Icons.Star className="w-8 h-8" active={true} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{station.isFavorite ? '取消收藏' : '添加收藏'}</span>
                </div>
            </div>
            <div 
                style={{ 
                    transform: `translateX(${offsetX}px)`,
                    transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    backgroundColor: palette.container,
                    borderColor: palette.border
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => Math.abs(offsetX) < 10 && onPlay(station)}
                className="relative flex items-center gap-4 px-4 py-3 cursor-pointer group select-none border-b"
            >
                <div className={`w-14 h-14 shadow-sm flex items-center justify-center overflow-hidden transition-all ${iconStyle === 'circle' ? 'rounded-full' : 'rounded-2xl'} border`} style={{ backgroundColor: palette.surface, borderColor: palette.border }}>
                    {station.iconUrl ? <img src={station.iconUrl} className="w-full h-full object-cover" onError={(e: any) => e.target.style.display = 'none'} /> : <Icons.Radio className="w-6 h-6 opacity-20" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold truncate" style={{ color: palette.primary }}>{station.name}</div>
                    <div className="text-[10px] truncate opacity-40 font-mono" style={{ color: palette.textSecondary }}>{station.url}</div>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => onToggleFavorite(station)} className={`p-2 transition-colors ${station.isFavorite ? 'text-yellow-500' : 'opacity-20 hover:opacity-100'}`}>
                        <Icons.Star className="w-5 h-5" active={station.isFavorite} />
                    </button>
                    <div className="w-10 h-10 flex items-center justify-center" style={{ color: isActive ? (palette.active || palette.primary) : palette.primary, opacity: isActive ? 1 : 0.3 }}>
                        {isActive && isPlaying ? <Icons.Pause className="w-7 h-7" /> : <Icons.Play className="w-7 h-7" />}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddView = ({ addStation, addStations, searchStations, isSearching, searchResults, setView, palette }: any) => {
    const tabs = ['search', 'manual', 'import'];
    const [tab, setTab] = useState('search');
    const [form, setForm] = useState({ name: '', url: '' });
    const [query, setQuery] = useState('');
    const [bulkText, setBulkText] = useState('');
    const inputBg = palette.surface === '#000000' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const deltaX = touchStartX.current - touchEndX.current;
        const currentIdx = tabs.indexOf(tab);

        if (Math.abs(deltaX) > 80) { // Significant horizontal swipe
            if (deltaX > 0 && currentIdx < tabs.length - 1) {
                // Swipe Left -> Next Tab
                setTab(tabs[currentIdx + 1]);
                if (navigator.vibrate) navigator.vibrate(10);
            } else if (deltaX < 0 && currentIdx > 0) {
                // Swipe Right -> Prev Tab
                setTab(tabs[currentIdx - 1]);
                if (navigator.vibrate) navigator.vibrate(10);
            }
        }
    };

    return (
        <div 
            className="h-full flex flex-col p-4 space-y-6 animate-fade-in select-none" 
            style={{ backgroundColor: palette.surface }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex p-1 rounded-full relative z-10" style={{ backgroundColor: inputBg }}>
                {tabs.map(t => (
                    <button 
                        key={t} 
                        onClick={() => setTab(t)} 
                        className={`flex-1 py-2 rounded-full text-[10px] font-black uppercase transition-all relative z-10 ${tab === t ? 'shadow-sm' : 'opacity-40'}`} 
                        style={{ color: palette.primary, backgroundColor: tab === t ? (palette.surface === '#000000' ? palette.border : '#FFFFFF') : 'transparent' }}
                    >
                        {t === 'search' ? '搜索' : t === 'manual' ? '手动' : '导入'}
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                <div className={`transition-all duration-300 h-full ${tab === 'search' ? 'block' : 'hidden'}`}>
                    <div className="space-y-4 h-full flex flex-col">
                        <div className="relative">
                            <input type="text" placeholder="发现全球广播..." className="w-full h-12 rounded-2xl px-10 focus:outline-none transition-all" style={{ backgroundColor: inputBg, color: palette.primary }} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchStations(query)} />
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                            <button onClick={() => searchStations(query)} className="absolute right-2 top-2 px-4 h-8 rounded-xl text-xs font-bold" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>搜</button>
                        </div>
                        <div className="flex-1 space-y-px overflow-y-auto no-scrollbar">
                            {isSearching ? <div className="text-center py-12 opacity-40 animate-pulse font-bold">正在搜寻全球波段...</div> : searchResults.map((r: any) => (
                                <div key={r.id + r.url} onClick={() => addStation(r)} className="flex items-center gap-3 p-3 border-b active:scale-95 transition-transform" style={{ borderColor: palette.border }}>
                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: inputBg }}>
                                        {r.iconUrl ? <img src={r.iconUrl} className="w-full h-full object-cover" /> : <Icons.Radio className="w-full h-full p-2 opacity-10" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold truncate">{r.name}</div>
                                        <div className="text-[9px] opacity-40 truncate uppercase" style={{ color: palette.textSecondary }}>{r.notes}</div>
                                    </div>
                                    <Icons.Plus className="w-6 h-6 opacity-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`transition-all duration-300 h-full ${tab === 'manual' ? 'block' : 'hidden'}`}>
                    <div className="space-y-4">
                        <input placeholder="电台名称" className="w-full h-12 rounded-2xl px-4 focus:outline-none" style={{ backgroundColor: inputBg, color: palette.primary }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <input placeholder="流媒体 URL" className="w-full h-12 rounded-2xl px-4 focus:outline-none" style={{ backgroundColor: inputBg, color: palette.primary }} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
                        <button onClick={() => { if (form.url) { addStation(form); setView('LIST'); } }} className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest shadow-lg" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>添加电台</button>
                    </div>
                </div>

                <div className={`transition-all duration-300 h-full ${tab === 'import' ? 'block' : 'hidden'}`}>
                    <div className="space-y-4 h-full flex flex-col">
                        <textarea placeholder="粘贴 M3U 播放列表内容..." className="flex-1 w-full rounded-2xl p-4 focus:outline-none text-[10px] font-mono" style={{ backgroundColor: inputBg, color: palette.primary }} value={bulkText} onChange={e => setBulkText(e.target.value)} />
                        <button onClick={() => { const p = parseM3U(bulkText); if (p.length) { addStations(p); setView('LIST'); } }} className="w-full h-14 rounded-2xl font-bold uppercase transition-all shadow-lg" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>导入 M3U 内容</button>
                    </div>
                </div>
            </div>
            
            <div className="text-center pb-2 opacity-20 text-[8px] font-bold uppercase tracking-widest">
                左右滑动切换模式
            </div>
        </div>
    );
};

const App = () => {
    const [hasAgreedPrivacy, setHasAgreedPrivacy] = useState(safeStorage.getItem('transistor_privacy_agreed') === 'true');
    const [stations, setStations] = useState<any[]>([]);
    const [currentView, setCurrentView] = useState('LIST');
    const [activeStation, setActiveStation] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({ themeColor: 'purple', iconStyle: 'circle', preferredLightTheme: 'purple' });
    const [sleepTimer, setSleepTimer] = useState<number | null>(null);
    const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [searchQuery, setSearchQuery] = useState('');
    const [remoteResults, setRemoteResults] = useState([]);
    const [isRemoteSearching, setIsRemoteSearching] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const sleepIntervalRef = useRef<any>(null);

    useEffect(() => {
        const saved = safeStorage.getItem('transistor_v3_standalone');
        let initialSettings = { themeColor: 'purple', iconStyle: 'circle', preferredLightTheme: 'purple' };
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setStations(parsed.stations || []);
                if (parsed.settings) initialSettings = { ...initialSettings, ...parsed.settings };
            } catch (e) { console.error("Restore failed", e); }
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e: any) => {
            setSettings(prev => ({
                ...prev,
                themeColor: e.matches ? 'black' : (prev.preferredLightTheme || 'purple')
            }));
        };
        if (!saved) handleThemeChange(mediaQuery);
        else setSettings(initialSettings);
        mediaQuery.addEventListener('change', handleThemeChange);
        return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }, []);

    useEffect(() => {
        safeStorage.setItem('transistor_v3_standalone', JSON.stringify({ stations, settings }));
    }, [stations, settings]);

    useEffect(() => {
        if (!audioRef.current) audioRef.current = new Audio();
        const a = audioRef.current;
        a.volume = volume;
        const handlers = {
            play: () => { setIsPlaying(true); setIsLoading(false); },
            pause: () => setIsPlaying(false),
            waiting: () => setIsLoading(true),
            canplay: () => setIsLoading(false),
            error: () => { setIsPlaying(false); setIsLoading(false); }
        };
        Object.entries(handlers).forEach(([ev, fn]) => a.addEventListener(ev, fn));
        return () => Object.entries(handlers).forEach(([ev, fn]) => a.removeEventListener(ev, fn));
    }, [volume]);

    useEffect(() => {
        if (sleepTimer !== null && sleepTimer > 0) {
            sleepIntervalRef.current = setInterval(() => {
                setSleepTimer(t => (t && t > 1 ? t - 1 : (audioRef.current?.pause(), null)));
            }, 60000);
        } else {
            clearInterval(sleepIntervalRef.current);
        }
        return () => clearInterval(sleepIntervalRef.current);
    }, [sleepTimer]);

    const playStation = async (s: any) => {
        if (activeStation?.url === s.url && isPlaying) {
            audioRef.current?.pause();
        } else {
            setActiveStation(s);
            setIsLoading(true);
            if (audioRef.current) {
                audioRef.current.src = s.url;
                try { await audioRef.current.play(); } catch (e) { console.error(e); }
            }
        }
    };

    const searchStations = async (q: string) => {
        if (!q.trim()) return;
        setIsRemoteSearching(true);
        try {
            const res = await fetch(`https://all.api.radio-browser.info/json/stations/byname/${encodeURIComponent(q)}?limit=30`);
            if (!res.ok) throw new Error("Database request failed");
            const data = await res.json();
            setRemoteResults(data.map((r: any) => ({
                id: r.changeuuid,
                name: r.name,
                url: r.url_resolved,
                iconUrl: r.favicon,
                notes: r.country
            })));
        } catch (e) {
            console.error("Search failed:", e);
            alert("由于网络原因无法连接至电台数据库，请检查您的网络设置。");
            setRemoteResults([]);
        } finally {
            setIsRemoteSearching(false);
        }
    };

    const palette = THEME_PALETTES[settings.themeColor as keyof typeof THEME_PALETTES] || THEME_PALETTES.purple;
    const inputBg = palette.surface === '#000000' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

    const filteredList = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return stations
            .filter(s => s.name.toLowerCase().includes(q))
            .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0) || b.addedAt - a.addedAt);
    }, [stations, searchQuery]);

    if (!hasAgreedPrivacy) {
        return (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-fade-in">
                <div className="w-full max-w-md bg-white rounded-[40px] p-8 space-y-8 shadow-2xl overflow-hidden" style={{ backgroundColor: THEME_PALETTES.purple.container }}>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-purple-50">
                            <Icons.Shield className="w-12 h-12 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">隐私政策协议</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            感谢您选择 Transistor。在开始使用之前，请务必阅读并同意我们的隐私政策，以了解我们如何保护您的数据。
                        </p>
                        <a 
                            href="https://agreement-drcn.hispace.dbankcloud.cn/index.html?lang=zh&agreementId=1845500060129849728" 
                            target="_blank" 
                            className="text-sm font-bold text-purple-600 underline decoration-purple-200 underline-offset-4"
                        >
                            查看隐私政策详情
                        </a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => {
                                safeStorage.setItem('transistor_privacy_agreed', 'true');
                                setHasAgreedPrivacy(true);
                            }}
                            className="w-full h-14 bg-purple-600 text-white rounded-3xl font-bold uppercase tracking-widest shadow-lg shadow-purple-200 active:scale-95 transition-transform"
                        >
                            同意并进入
                        </button>
                        <button 
                            onClick={() => {
                                if (confirm('不同意隐私政策将无法使用本应用。确定要退出吗？')) {
                                    document.body.innerHTML = '<div style="height:100vh; display:flex; align-items:center; justify-content:center; background:#000; color:#fff; font-family:sans-serif;">已退出应用。请手动关闭此页面。</div>';
                                }
                            }}
                            className="w-full h-14 bg-slate-100 text-slate-600 rounded-3xl font-bold uppercase tracking-widest active:scale-95 transition-transform"
                        >
                            不同意并退出
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col transition-colors duration-700 overflow-hidden" style={{ backgroundColor: palette.surface, color: palette.primary }}>
            <style>{`:root { --primary: ${palette.active || palette.primary}; }`}</style>
            <header className="h-16 px-4 flex items-center justify-between border-b backdrop-blur-xl z-50 sticky top-0" style={{ borderColor: palette.border, backgroundColor: palette.surface === '#000000' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }}>
                <div className="flex items-center gap-3">
                    {currentView !== 'LIST' && <button onClick={() => { setCurrentView('LIST'); setSearchQuery(''); }} className="p-2 -ml-2"><Icons.ChevronLeft className="w-6 h-6" /></button>}
                    <h1 className="text-xl font-black uppercase tracking-tighter">
                        {currentView === 'LIST' ? 'Transistor' : currentView === 'ADD' ? '发现' : '设置'}
                    </h1>
                </div>
                {currentView === 'LIST' && (
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentView('ADD')} className="p-2 opacity-60"><Icons.Plus className="w-6 h-6" /></button>
                        <button onClick={() => setCurrentView('SETTINGS')} className="p-2 opacity-60"><Icons.Settings className="w-6 h-6" /></button>
                    </div>
                )}
            </header>
            <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {currentView === 'LIST' && (
                    <div className="h-full flex flex-col">
                        {stations.length > 0 && (
                            <div className="p-4 sticky top-0 z-10 border-b backdrop-blur-md" style={{ backgroundColor: palette.surface === '#000000' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)', borderColor: palette.border }}>
                                <div className="relative group">
                                    <Icons.Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all ${searchQuery ? 'opacity-100 scale-110' : 'opacity-30'}`} style={{ color: searchQuery ? (palette.active || palette.primary) : 'currentColor' }} />
                                    <input 
                                        placeholder="搜索本地电台..." 
                                        className="w-full h-11 pl-11 pr-10 rounded-full text-sm focus:outline-none transition-all border group-focus-within:shadow-lg" 
                                        style={{ backgroundColor: inputBg, borderColor: palette.border, color: palette.primary }} 
                                        value={searchQuery} 
                                        onChange={e => setSearchQuery(e.target.value)} 
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/10 transition-all opacity-40 hover:opacity-100"
                                        >
                                            <Icons.X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        {stations.length > 0 ? (
                            <div className="space-y-px">
                                {filteredList.length > 0 ? (
                                    filteredList.map(s => (
                                        <StationItem 
                                            key={s.url + s.addedAt} 
                                            station={s} 
                                            isActive={activeStation?.url === s.url} 
                                            isPlaying={isPlaying} 
                                            iconStyle={settings.iconStyle} 
                                            palette={palette} 
                                            onPlay={playStation} 
                                            onToggleFavorite={(st: any) => setStations(prev => prev.map(item => item.url === st.url ? {...item, isFavorite: !item.isFavorite} : item))} 
                                            onDelete={(st: any) => setStations(prev => prev.filter(item => item.url !== st.url))} 
                                        />
                                    ))
                                ) : (
                                    <div className="p-20 text-center space-y-4 opacity-40">
                                        <div className="text-4xl">🔍</div>
                                        <div className="font-bold">没有找到匹配的电台</div>
                                        <button onClick={() => setSearchQuery('')} className="text-xs underline font-black uppercase tracking-widest">重置搜索</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8">
                                <Icons.Radio className="w-24 h-24 opacity-5" />
                                <h2 className="text-2xl font-black tracking-tight">您的收音机还是静默的</h2>
                                <button onClick={() => setCurrentView('ADD')} className="px-10 py-4 rounded-full font-bold uppercase tracking-widest shadow-2xl" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>发现电台</button>
                            </div>
                        )}
                    </div>
                )}
                {currentView === 'ADD' && (
                    <AddView 
                        palette={palette} 
                        setView={setCurrentView} 
                        addStation={(s: any) => { setStations(p => [...p, {...s, id: Date.now().toString(), isFavorite: false, addedAt: Date.now()}]); setCurrentView('LIST'); }} 
                        addStations={(list: any[]) => { setStations(p => [...p, ...list]); setCurrentView('LIST'); }} 
                        searchStations={searchStations} 
                        isSearching={isRemoteSearching} 
                        searchResults={remoteResults} 
                    />
                )}
                {currentView === 'SETTINGS' && (
                    <div className="p-6 space-y-10 animate-fade-in">
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-2">色彩空间</h3>
                            <div className="grid grid-cols-4 gap-4 p-4 rounded-[32px]" style={{ backgroundColor: inputBg }}>
                                {Object.keys(THEME_PALETTES).map(c => (
                                    <button key={c} onClick={() => setSettings(s => ({ ...s, themeColor: c, ...(c !== 'black' ? { preferredLightTheme: c } : {}) }))} className={`aspect-square rounded-full border-4 transition-transform active:scale-90 ${settings.themeColor === c ? 'scale-110 border-white shadow-xl' : 'opacity-60 border-transparent'}`} style={{ backgroundColor: THEME_PALETTES[c as keyof typeof THEME_PALETTES].primary === '#FFFFFF' ? '#121212' : THEME_PALETTES[c as keyof typeof THEME_PALETTES].primary }} />
                                ))}
                            </div>
                        </section>
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-2">图标风格</h3>
                            <div className="flex gap-4 p-4 rounded-[32px]" style={{ backgroundColor: inputBg }}>
                                {['circle', 'square'].map(s => (
                                    <button key={s} onClick={() => setSettings({ ...settings, iconStyle: s })} className={`flex-1 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${settings.iconStyle === s ? 'shadow-lg' : 'opacity-40'}`} style={{ backgroundColor: settings.iconStyle === s ? (palette.surface === '#000000' ? palette.border : '#FFFFFF') : 'transparent', color: palette.primary }}>{s === 'circle' ? '圆形' : '圆角'}</button>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-2">全局备份</h3>
                            <div className="flex gap-4">
                                <button onClick={() => { const blob = new Blob([JSON.stringify(stations)], {type: 'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'radio_backup.json'; a.click(); }} className="flex-1 p-5 rounded-3xl flex flex-col items-center gap-2 border" style={{ backgroundColor: inputBg, borderColor: palette.border }}><Icons.Download className="w-6 h-6" /><span className="text-[10px] font-bold">导出数据</span></button>
                                <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.onchange = (e: any) => { const r = new FileReader(); r.onload = ev => { try { setStations(JSON.parse(ev.target?.result as string)); } catch(e) { alert("导入失败: 文件格式不正确"); } }; r.readAsText(e.target.files[0]); }; i.click(); }} className="flex-1 p-5 rounded-3xl flex flex-col items-center gap-2 border" style={{ backgroundColor: inputBg, borderColor: palette.border }}><Icons.Upload className="w-6 h-6" /><span className="text-[10px] font-bold">导入恢复</span></button>
                            </div>
                        </section>
                        <p className="text-center text-[10px] font-black opacity-10 tracking-[0.5em] pt-20">TRANSISTOR STANDALONE</p>
                    </div>
                )}
            </main>
            {activeStation && currentView !== 'FULL_PLAYER' && (
                <div onClick={() => setCurrentView('FULL_PLAYER')} className="fixed bottom-0 left-0 right-0 h-20 backdrop-blur-2xl border-t flex items-center justify-between px-4 z-40 animate-slide-up shadow-2xl" style={{ backgroundColor: palette.surface === '#000000' ? 'rgba(18,18,18,0.95)' : 'rgba(255,255,255,0.95)', borderColor: palette.border }}>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-12 h-12 shadow-md overflow-hidden flex-shrink-0 border-2 ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-xl'}`} style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
                            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" /> : <Icons.Radio className="w-full h-full p-3 opacity-10" />}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-black truncate">{activeStation.name}</div>
                            <div className="text-[10px] font-bold animate-pulse" style={{ color: palette.active || palette.primary }}>{isLoading ? '连接中...' : '在线播放中'}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={e => { e.stopPropagation(); setIsTimerDialogOpen(true); }} className="relative opacity-60"><Icons.Timer className="w-6 h-6" />{sleepTimer && <span className="absolute -top-2 -right-2 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>{sleepTimer}</span>}</button>
                        <button onClick={e => { e.stopPropagation(); isPlaying ? audioRef.current?.pause() : audioRef.current?.play(); }} className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>
                            <div className="flex items-center justify-center w-full h-full">
                                {isPlaying ? <Icons.Pause className="w-6 h-6" /> : <Icons.Play className="w-6 h-6 ml-1" />}
                            </div>
                        </button>
                    </div>
                </div>
            )}
            {currentView === 'FULL_PLAYER' && activeStation && (
                <div className="fixed inset-0 z-[100] flex flex-col p-8 animate-slide-up" style={{ backgroundColor: palette.surface }}>
                    <div className="flex justify-between items-center">
                        <button onClick={() => setCurrentView('LIST')} className="p-3 rounded-full" style={{ backgroundColor: inputBg }}><Icons.ChevronLeft className="w-6 h-6" /></button>
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">TRANSISTOR</div>
                        <button className="p-3 opacity-20" onClick={() => { if(confirm('移除此电台？')) { setStations(prev => prev.filter(i => i.url !== activeStation.url)); setCurrentView('LIST'); setActiveStation(null); audioRef.current?.pause(); } }}><Icons.Trash className="w-6 h-6" /></button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-10">
                        <div className={`w-64 h-64 shadow-2xl border-[8px] flex items-center justify-center overflow-hidden transform transition-all duration-700 ${isPlaying ? 'scale-100' : 'scale-90 opacity-60'} ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-[48px]'}`} style={{ borderColor: palette.container, backgroundColor: palette.container }}>
                            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" /> : <Icons.Radio className="w-24 h-24 opacity-5" />}
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black leading-tight truncate max-w-[300px]">{activeStation.name}</h2>
                            <p className="text-[10px] font-mono opacity-30 truncate max-w-[200px] mx-auto">{activeStation.url}</p>
                        </div>
                        <button onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()} className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>
                            <div className="flex items-center justify-center w-full h-full">
                                {isPlaying ? <Icons.Pause className="w-10 h-10" /> : <Icons.Play className="w-10 h-10 ml-2" />}
                            </div>
                        </button>
                        <div className="w-full max-w-[200px] flex items-center gap-4 opacity-40">
                            <Icons.Volume2 className="w-5 h-5" />
                            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="flex-1 h-1 rounded-full appearance-none bg-current opacity-20 cursor-pointer" />
                        </div>
                    </div>
                </div>
            )}
            {isTimerDialogOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[200] flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setIsTimerDialogOpen(false)}>
                    <div className="w-full max-w-sm rounded-[40px] p-8 shadow-2xl space-y-8" style={{ backgroundColor: palette.container }} onClick={e => e.stopPropagation()}>
                        <div className="text-center space-y-1">
                            <h3 className="text-2xl font-black tracking-tight">睡眠计时</h3>
                            <p className="text-xs opacity-40">设定后自动停止信号传输</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[15, 30, 45, 60, 90, 0].map(m => (
                                <button key={m} onClick={() => { setSleepTimer(m || null); setIsTimerDialogOpen(false); }} className={`h-16 rounded-[20px] font-bold transition-all active:scale-95 ${sleepTimer === m && m !== 0 ? 'shadow-lg' : ''}`} style={{ backgroundColor: sleepTimer === m && m !== 0 ? (palette.active || palette.primary) : inputBg, color: sleepTimer === m && m !== 0 ? '#FFFFFF' : palette.primary }}>{m === 0 ? '取消' : `${m}m`}</button>
                            ))}
                        </div>
                        <button onClick={() => setIsTimerDialogOpen(false)} className="w-full py-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-30">关闭</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);