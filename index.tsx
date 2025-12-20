
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- Constants & Palettes ---
const THEME_PALETTES: Record<string, any> = {
    purple: { primary: '#6750A4', container: '#EADDFF', onContainer: '#21005D', surface: '#F7F2FA', border: '#E7E0EC', textSecondary: '#49454F' },
    blue: { primary: '#0061A4', container: '#D1E4FF', onContainer: '#001D36', surface: '#F8FBFF', border: '#D1E4FF', textSecondary: '#49454F' },
    green: { primary: '#006D32', container: '#98FB9D', onContainer: '#00210A', surface: '#F7FFF7', border: '#C0EED2', textSecondary: '#49454F' },
    red: { primary: '#BA1A1A', container: '#FFDAD6', onContainer: '#410002', surface: '#FFF8F7', border: '#FFDAD6', textSecondary: '#49454F' },
    orange: { primary: '#8B5000', container: '#FFDDB3', onContainer: '#2C1600', surface: '#FFF8F2', border: '#FFDDB3', textSecondary: '#49454F' },
    black: { primary: '#FFFFFF', container: '#1C1B1F', onContainer: '#E6E1E5', surface: '#000000', border: '#313033', textSecondary: '#CAC4D0' },
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
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
    Play: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z" /></svg>
    ),
    Pause: (props: any) => (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
    ),
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
    ChevronLeft: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6" /></svg>
    ),
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
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
    ),
    X: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    Download: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
    ),
    Upload: (props: any) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
    )
};

// --- Utilities ---
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
                addedAt: Date.now()
            });
            currentMeta = {};
        }
    }
    return stations;
};

// --- Components ---

const StationItem = ({ 
    station, 
    isActive, 
    isPlaying, 
    iconStyle, 
    onPlay, 
    onToggleFavorite, 
    onDelete 
}: any) => {
    const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);
    const itemRef = useRef<HTMLDivElement>(null);
    const threshold = 150; // Distance for direct action

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX.current;
        setOffsetX(diff);
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        const screenWidth = window.innerWidth;
        
        if (offsetX < -threshold) {
            // Full swipe left - Delete
            onDelete(station);
        } else if (offsetX > threshold) {
            // Full swipe right - Favorite
            onToggleFavorite(station);
            setOffsetX(0);
        } else {
            // Reset position
            setOffsetX(0);
        }
    };

    const opacityAction = Math.min(Math.abs(offsetX) / threshold, 1);

    return (
        <div className="relative overflow-hidden bg-slate-100">
            {/* Action Layers */}
            {/* Delete Layer (Left Swipe) */}
            <div 
                className={`absolute inset-0 bg-[#BA1A1A] flex items-center justify-end px-8 transition-opacity`}
                style={{ opacity: offsetX < 0 ? opacityAction : 0 }}
            >
                <div className="flex flex-col items-center gap-1 text-white animate-fade-in">
                    <Icons.Trash className="w-8 h-8" />
                    <span className="text-xs font-black uppercase tracking-widest">释放删除</span>
                </div>
            </div>

            {/* Favorite Layer (Right Swipe) */}
            <div 
                className={`absolute inset-0 bg-yellow-500 flex items-center justify-start px-8 transition-opacity`}
                style={{ opacity: offsetX > 0 ? opacityAction : 0 }}
            >
                <div className="flex flex-col items-center gap-1 text-white animate-fade-in">
                    <Icons.Star className="w-8 h-8" active={true} />
                    <span className="text-xs font-black uppercase tracking-widest">
                        {station.isFavorite ? '取消收藏' : '添加收藏'}
                    </span>
                </div>
            </div>

            {/* Main Station Item Layer */}
            <div 
                ref={itemRef}
                style={{ 
                    transform: `translateX(${offsetX}px)`,
                    transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => offsetX === 0 && onPlay(station)}
                className="relative bg-white flex items-center gap-4 px-4 py-3 hover:bg-black/[0.02] cursor-pointer group select-none border-b border-slate-50"
            >
                <div className={`w-14 h-14 bg-white shadow-sm flex items-center justify-center overflow-hidden transition-all ${iconStyle === 'circle' ? 'rounded-full' : 'rounded-2xl'} group-active:scale-90 border border-slate-100`}>
                    {station.iconUrl ? <img src={station.iconUrl} className="w-full h-full object-cover" onError={(e: any) => e.target.style.display = 'none'} /> : <Icons.Radio className="w-6 h-6 opacity-20" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold truncate text-slate-800">{station.name}</div>
                    <div className="text-[10px] text-slate-400 truncate opacity-60 font-mono">{station.url}</div>
                </div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button 
                        onClick={() => onToggleFavorite(station)} 
                        className={`p-2 transition-colors ${station.isFavorite ? 'text-yellow-500' : 'text-slate-300 hover:text-primary'}`}
                    >
                        <Icons.Star className="w-5 h-5" active={station.isFavorite} />
                    </button>
                    <div className="text-primary">
                        {isActive && isPlaying ? <Icons.Pause className="w-7 h-7" /> : <Icons.Play className="w-7 h-7" />}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Views ---

const AddView = ({ addStation, addStations, searchStations, isSearching, searchResults, setView }: any) => {
    const [tab, setTab] = useState('search');
    const [form, setForm] = useState({ name: '', url: '' });
    const [query, setQuery] = useState('');
    const [bulkText, setBulkText] = useState('');

    const count = useMemo(() => (tab === 'import' ? parseM3U(bulkText).length : 0), [bulkText, tab]);

    return (
        <div className="p-4 space-y-6 animate-fade-in">
            <div className="flex bg-slate-200/50 p-1 rounded-full">
                {['search', 'manual', 'import'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-full text-xs font-bold uppercase transition-all ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}>
                        {t === 'search' ? '搜索' : t === 'manual' ? '手动' : '导入'}
                    </button>
                ))}
            </div>

            {tab === 'search' && (
                <div className="space-y-4">
                    <div className="relative">
                        <input type="text" placeholder="发现全球广播..." className="w-full h-12 bg-slate-100 rounded-2xl px-10 focus:outline-none focus:ring-2 ring-primary/20" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchStations(query)} />
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                        <button onClick={() => searchStations(query)} className="absolute right-2 top-2 px-4 h-8 bg-primary text-white rounded-xl text-xs font-bold">搜</button>
                    </div>
                    <div className="space-y-2 overflow-y-auto max-h-[60vh] no-scrollbar">
                        {isSearching ? <div className="text-center py-12 text-slate-400">正在寻找波段...</div> : searchResults.map((r: any) => (
                            <div key={r.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl group active:scale-95 transition-transform">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                    {r.iconUrl ? <img src={r.iconUrl} className="w-full h-full object-cover" onError={(e: any) => e.target.style.display = 'none'} /> : <Icons.Radio className="w-full h-full p-3 opacity-20" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate text-slate-800">{r.name}</div>
                                    <div className="text-[10px] text-slate-400 truncate uppercase tracking-widest">{r.notes}</div>
                                </div>
                                <button onClick={() => addStation(r)} className="w-10 h-10 flex items-center justify-center text-primary bg-primary/10 rounded-full"><Icons.Plus className="w-6 h-6" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'manual' && (
                <div className="space-y-4">
                    <input placeholder="电台名称" className="w-full h-12 bg-slate-100 rounded-2xl px-4 focus:outline-none" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input placeholder="流媒体 URL (http/https)" className="w-full h-12 bg-slate-100 rounded-2xl px-4 focus:outline-none" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
                    <button onClick={() => { if (form.url) { addStation(form); setView('LIST'); } }} className="w-full h-14 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-primary/20">添加电台</button>
                </div>
            )}

            {tab === 'import' && (
                <div className="space-y-4">
                    <textarea placeholder="粘贴 M3U 播放列表内容..." className="w-full h-64 bg-slate-100 rounded-2xl p-4 focus:outline-none text-xs font-mono leading-relaxed" value={bulkText} onChange={e => setBulkText(e.target.value)} />
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">支持读取 Logo 标签</span>
                        {count > 0 && <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-black">发现 {count} 个电台</span>}
                    </div>
                    <button onClick={() => { const p = parseM3U(bulkText); if (p.length) { addStations(p); setView('LIST'); } }} disabled={count === 0} className={`w-full h-14 bg-primary text-white rounded-2xl font-bold uppercase transition-all ${count === 0 ? 'opacity-30' : 'shadow-lg shadow-primary/20'}`}>开始导入</button>
                </div>
            )}
        </div>
    );
};

// --- App Component ---

const App = () => {
    const [stations, setStations] = useState<any[]>([]);
    const [currentView, setCurrentView] = useState('LIST');
    const [activeStation, setActiveStation] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({ themeColor: 'purple', iconStyle: 'circle' });
    const [sleepTimer, setSleepTimer] = useState<number | null>(null);
    const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [searchQuery, setSearchQuery] = useState('');
    const [remoteResults, setRemoteResults] = useState([]);
    const [isRemoteSearching, setIsRemoteSearching] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const sleepIntervalRef = useRef<any>(null);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('transistor_v2_data');
        if (saved) {
            const { stations, settings } = JSON.parse(saved);
            setStations(stations || []);
            setSettings(settings || { themeColor: 'purple', iconStyle: 'circle' });
        }
    }, []);

    // Sync to Storage
    useEffect(() => {
        localStorage.setItem('transistor_v2_data', JSON.stringify({ stations, settings }));
    }, [stations, settings]);

    // Audio Setup
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

    // Timer Logic
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

    const deleteStation = (s: any) => {
        if (activeStation?.url === s.url) {
            audioRef.current?.pause();
            setActiveStation(null);
        }
        setStations(prev => prev.filter(item => item.url !== s.url));
    };

    const toggleFavorite = (s: any) => {
        setStations(prev => prev.map(item => item.url === s.url ? { ...item, isFavorite: !item.isFavorite } : item));
    };

    const palette = THEME_PALETTES[settings.themeColor];

    const filteredList = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return stations
            .filter(s => s.name.toLowerCase().includes(q))
            .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0) || b.addedAt - a.addedAt);
    }, [stations, searchQuery]);

    return (
        <div className="h-screen w-full flex flex-col transition-colors duration-500 overflow-hidden" style={{ backgroundColor: palette.surface, color: palette.primary }}>
            <style>{`:root { --primary: ${palette.primary}; } .text-primary { color: var(--primary); } .bg-primary { background-color: var(--primary); }`}</style>
            
            {/* Header */}
            <header className="h-16 px-4 flex items-center justify-between border-b bg-white/50 backdrop-blur-md z-10" style={{ borderColor: palette.border }}>
                <div className="flex items-center gap-3">
                    {currentView !== 'LIST' && <button onClick={() => setCurrentView('LIST')} className="p-2 -ml-2 text-primary"><Icons.ChevronLeft className="w-6 h-6" /></button>}
                    <h1 className="text-xl font-black uppercase tracking-tighter text-primary">
                        {currentView === 'LIST' ? 'Transistor' : currentView === 'ADD' ? '发现' : '设置'}
                    </h1>
                </div>
                {currentView === 'LIST' && (
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentView('ADD')} className="p-2 text-primary"><Icons.Plus className="w-6 h-6" /></button>
                        <button onClick={() => setCurrentView('SETTINGS')} className="p-2 text-primary"><Icons.Settings className="w-6 h-6" /></button>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {currentView === 'LIST' && (
                    <div className="h-full flex flex-col">
                        <div className="sticky top-0 bg-inherit z-10">
                            {stations.length > 0 && (
                                <div className="p-4 bg-white/50 backdrop-blur-sm border-b" style={{ borderColor: palette.border }}>
                                    <div className="relative">
                                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                                        <input placeholder="搜索已存电台..." className="w-full h-10 pl-10 pr-4 bg-white/20 border rounded-full text-sm focus:outline-none" style={{ borderColor: palette.border }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                    </div>
                                    <div className="flex justify-between items-center mt-3 px-2">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">← 左滑删除</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">右滑收藏 →</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {stations.length > 0 ? (
                            filteredList.length > 0 ? (
                                <div className="space-y-px">
                                    {filteredList.map(s => (
                                        <StationItem 
                                            key={s.id || s.url}
                                            station={s}
                                            isActive={activeStation?.url === s.url}
                                            isPlaying={isPlaying}
                                            iconStyle={settings.iconStyle}
                                            onPlay={playStation}
                                            onToggleFavorite={toggleFavorite}
                                            onDelete={deleteStation}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <Icons.Search className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <h3 className="font-bold text-slate-400 mb-1">未找到匹配电台</h3>
                                    <button onClick={() => setSearchQuery('')} className="px-6 py-2 bg-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest mt-4">清除搜索</button>
                                </div>
                            )
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 animate-fade-in text-center space-y-6">
                                <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center">
                                    <Icons.Radio className="w-12 h-12 text-primary opacity-20" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">您的收音机还是静默的</h2>
                                    <p className="text-sm text-slate-400 max-w-[240px] leading-relaxed">全世界数千个精彩广播电台正等待您的探索。现在就开始吧！</p>
                                </div>
                                <button onClick={() => setCurrentView('ADD')} className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-[0.15em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                    <Icons.Plus className="w-5 h-5" />
                                    发现电台
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {currentView === 'ADD' && (
                    <AddView addStation={(s: any) => setStations(p => [...p, { ...s, id: Date.now().toString(), isFavorite: false }])} addStations={(list: any[]) => setStations(p => [...p, ...list])} searchStations={async (q: string) => {
                        setIsRemoteSearching(true);
                        try {
                            const res = await fetch(`https://de1.api.radio-browser.info/json/stations/byname/${encodeURIComponent(q)}?limit=25`);
                            const data = await res.json();
                            setRemoteResults(data.map((r: any) => ({ id: r.changeuuid, name: r.name, url: r.url_resolved, iconUrl: r.favicon, notes: r.country })));
                        } catch (e) { console.error(e); } finally { setIsRemoteSearching(false); }
                    }} isSearching={isRemoteSearching} searchResults={remoteResults} setView={setCurrentView} />
                )}

                {currentView === 'SETTINGS' && (
                    <div className="p-6 space-y-8 animate-fade-in">
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">色彩空间</h3>
                            <div className="flex gap-3">
                                {Object.keys(THEME_PALETTES).map(c => (
                                    <button key={c} onClick={() => setSettings({ ...settings, themeColor: c })} className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-90 ${settings.themeColor === c ? 'scale-110' : 'opacity-60 border-transparent'}`} style={{ backgroundColor: THEME_PALETTES[c].primary }} />
                                ))}
                            </div>
                        </section>
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">数据仓库</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => {
                                    const blob = new Blob([JSON.stringify(stations)], { type: 'application/json' });
                                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'radio_backup.json'; a.click();
                                }} className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm"><Icons.Download className="w-6 h-6" /><span className="text-[10px] font-bold">导出备份</span></button>
                                <button onClick={() => {
                                    const i = document.createElement('input'); i.type = 'file';
                                    i.onchange = (e: any) => {
                                        const f = e.target.files[0];
                                        const r = new FileReader();
                                        r.onload = ev => setStations(JSON.parse(ev.target?.result as string));
                                        r.readAsText(f);
                                    };
                                    i.click();
                                }} className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-2 shadow-sm"><Icons.Upload className="w-6 h-6" /><span className="text-[10px] font-bold">导入恢复</span></button>
                            </div>
                        </section>
                        <p className="text-center text-[10px] font-black opacity-10 tracking-[0.4em] pt-12">TRANSISTOR v2.0</p>
                    </div>
                )}
            </main>

            {/* Bottom Controls / Mini Player */}
            {activeStation && currentView !== 'FULL_PLAYER' && (
                <div onClick={() => setCurrentView('FULL_PLAYER')} className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-t flex items-center justify-between px-4 z-40 animate-slide-up shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" /> : <Icons.Radio className="w-full h-full p-3 opacity-10" />}
                        </div>
                        <div className="min-w-0">
                            <div className="text-sm font-black truncate text-slate-800">{activeStation.name}</div>
                            <div className="text-[10px] text-primary font-bold animate-pulse">{isLoading ? '正在建立连接...' : '实时波段中'}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={e => { e.stopPropagation(); setIsTimerDialogOpen(true); }} className="relative"><Icons.Timer className={`w-6 h-6 ${sleepTimer ? 'text-primary' : 'opacity-20'}`} />{sleepTimer && <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{sleepTimer}</span>}</button>
                        <button onClick={e => { e.stopPropagation(); audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause(); }} className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20">{isPlaying ? <Icons.Pause className="w-6 h-6" /> : <Icons.Play className="w-6 h-6 ml-1" />}</button>
                    </div>
                </div>
            )}

            {/* Full Player Overlay */}
            {currentView === 'FULL_PLAYER' && activeStation && (
                <div className="fixed inset-0 bg-white z-[100] flex flex-col p-8 animate-slide-up" style={{ backgroundColor: palette.surface }}>
                    <div className="flex justify-between">
                        <button onClick={() => setCurrentView('LIST')} className="p-2 text-primary bg-slate-100 rounded-full"><Icons.ChevronLeft className="w-6 h-6" /></button>
                        <div className="text-center">
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">正在播放</div>
                            <div className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{activeStation.name}</div>
                        </div>
                        <button onClick={() => { if (confirm('确定移除此电台？')) { deleteStation(activeStation); setCurrentView('LIST'); } }} className="p-2 text-slate-300"><Icons.Trash className="w-6 h-6" /></button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-12">
                        <div className={`w-72 h-72 bg-white shadow-2xl border-4 border-white flex items-center justify-center overflow-hidden transform transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-95 grayscale-[0.5]'} ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-[40px]'}`}>
                            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" /> : <Icons.Radio className="w-32 h-32 opacity-10" />}
                        </div>
                        <div className="flex flex-col items-center gap-4 w-full">
                            <button onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()} className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 active:scale-90 transition-transform">
                                {isPlaying ? <Icons.Pause className="w-10 h-10" /> : <Icons.Play className="w-10 h-10 ml-2" />}
                            </button>
                            <div className="w-full max-w-xs flex items-center gap-4 mt-8">
                                <Icons.Volume2 className="w-5 h-5 opacity-40" />
                                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="flex-1 accent-primary h-1 bg-slate-200 rounded-full appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 pt-12">
                        <button onClick={() => setIsTimerDialogOpen(true)} className="flex flex-col items-center gap-1"><Icons.Timer className={`w-6 h-6 ${sleepTimer ? 'text-primary' : 'opacity-20'}`} /><span className="text-[10px] font-bold uppercase">{sleepTimer ? `${sleepTimer}m` : '定时'}</span></button>
                        <button onClick={() => toggleFavorite(activeStation)} className="flex flex-col items-center gap-1"><Icons.Star className={`w-6 h-6 ${activeStation.isFavorite ? 'text-yellow-500' : 'opacity-20'}`} active={activeStation.isFavorite} /><span className="text-[10px] font-bold uppercase">收藏</span></button>
                        <button onClick={() => { navigator.clipboard.writeText(activeStation.url); alert('URL 已复制'); }} className="flex flex-col items-center gap-1 opacity-20"><Icons.Plus className="w-6 h-6 rotate-45" /><span className="text-[10px] font-bold uppercase">分享</span></button>
                    </div>
                </div>
            )}

            {/* Timer Dialog */}
            {isTimerDialogOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setIsTimerDialogOpen(false)}>
                    <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl space-y-8" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">睡眠计时</h3>
                            <p className="text-sm text-slate-400">时间归零后自动切断信号</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[15, 30, 60, 90, 120, 0].map(m => (
                                <button key={m} onClick={() => { setSleepTimer(m || null); setIsTimerDialogOpen(false); }} className={`h-16 rounded-2xl font-black text-sm transition-all active:scale-95 ${sleepTimer === m && m !== 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    {m === 0 ? '取消' : `${m}m`}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsTimerDialogOpen(false)} className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-300">关闭窗口</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = createRoot(rootEl);
    root.render(<App />);
}
