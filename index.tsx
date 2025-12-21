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

const TABS = ['search', 'manual', 'import'];

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
            <line x1="18" x2="6" y1="6" y2="18"></line>
            <line x1="6" x2="18" y1="6" y2="18"></line>
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
    const [tab, setTab] = useState('search');
    const [form, setForm] = useState({ name: '', url: '' });
    const [query, setQuery] = useState('');
    const [bulkText, setBulkText] = useState('');
    
    // UI State for Layout & Dragging
    const [layoutWidth, setLayoutWidth] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragOffsetRef = useRef(0);
    const activeIdx = TABS.indexOf(tab);
    const activeIdxRef = useRef(activeIdx);
    
    // Touch tracking refs
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const directionFixed = useRef<'none' | 'horiz' | 'vert'>('none');
    
    // Theme Colors
    const inputBg = palette.surface === '#000000' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    const pillBg = palette.surface === '#000000' ? '#333333' : '#FFFFFF';

    useEffect(() => {
        activeIdxRef.current = activeIdx;
    }, [activeIdx]);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(entries => {
            if (entries[0]) {
                setLayoutWidth(entries[0].contentRect.width);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
            directionFixed.current = 'none';
            setIsDragging(false);
            dragOffsetRef.current = 0;
        };

        const onTouchMove = (e: TouchEvent) => {
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = currentX - touchStartX.current;
            const deltaY = Math.abs(currentY - touchStartY.current);

            if (directionFixed.current === 'none') {
                if (Math.abs(deltaX) > 5 || deltaY > 5) {
                    if (Math.abs(deltaX) > deltaY * 0.8) {
                        directionFixed.current = 'horiz';
                        setIsDragging(true);
                    } else {
                        directionFixed.current = 'vert';
                    }
                }
            }

            if (directionFixed.current === 'horiz') {
                if (e.cancelable) e.preventDefault();
                let offset = deltaX;
                const currentIdx = activeIdxRef.current;
                const tabLen = TABS.length;
                
                if ((currentIdx === 0 && deltaX > 0) || (currentIdx === tabLen - 1 && deltaX < 0)) {
                    offset = deltaX * 0.3;
                }
                
                dragOffsetRef.current = offset;
                setDragOffset(offset);
            }
        };

        const onTouchEnd = () => {
            if (directionFixed.current === 'horiz') {
                const width = layoutWidth || window.innerWidth;
                const threshold = width * 0.22;
                const offset = dragOffsetRef.current;
                const currentIdx = activeIdxRef.current;

                if (offset < -threshold && currentIdx < TABS.length - 1) {
                    setTab(TABS[currentIdx + 1]);
                    if (navigator.vibrate) navigator.vibrate(10);
                } else if (offset > threshold && currentIdx > 0) {
                    setTab(TABS[currentIdx - 1]);
                    if (navigator.vibrate) navigator.vibrate(10);
                }
            }
            setIsDragging(false);
            setDragOffset(0);
            dragOffsetRef.current = 0;
            directionFixed.current = 'none';
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd, { passive: true });

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [layoutWidth]);

    const effectiveWidth = layoutWidth || (window.innerWidth - 32);
    // Indicator math: p-1.5 = 6px padding on left/right.
    const slotWidth = (effectiveWidth - 12) / TABS.length; 
    const dragRatio = dragOffset / effectiveWidth;
    const pillTranslateX = 6 + (activeIdx * slotWidth) - (dragRatio * slotWidth);

    return (
        <div 
            ref={containerRef}
            className="flex-1 flex flex-col p-4 pt-1 space-y-6 animate-fade-in select-none overflow-hidden min-h-0" 
            style={{ backgroundColor: palette.surface }}
        >
            {/* Tab Bar */}
            <div className="flex p-1.5 rounded-[24px] relative z-10 overflow-hidden flex-shrink-0" style={{ backgroundColor: inputBg }}>
                <div 
                    className={`absolute top-1.5 bottom-1.5 rounded-[20px] shadow-lg ${isDragging ? '' : 'transition-transform duration-300 cubic-bezier(0.2, 0, 0, 1)'}`}
                    style={{ 
                        left: 0,
                        width: `${slotWidth}px`,
                        backgroundColor: pillBg,
                        willChange: 'transform',
                        transform: `translateX(${pillTranslateX}px) translateZ(0)`
                    }}
                />
                {TABS.map(t => (
                    <button 
                        key={t} 
                        onClick={() => { setTab(t); if (navigator.vibrate) navigator.vibrate(5); }} 
                        className={`flex-1 py-3 rounded-full text-[13px] font-black uppercase tracking-tight transition-all relative z-20 ${tab === t ? 'opacity-100' : 'opacity-40'}`} 
                        style={{ color: palette.primary }}
                    >
                        {t === 'search' ? '搜索' : t === 'manual' ? '手动' : '导入'}
                    </button>
                ))}
            </div>
            
            {/* Main Content Panels Container */}
            <div className="flex-1 overflow-hidden relative min-h-0">
                <div 
                    className={`flex h-full will-change-transform ${isDragging ? '' : 'transition-transform duration-300 cubic-bezier(0.2, 0, 0, 1)'}`}
                    style={{ 
                        transform: `translateX(calc(-${activeIdx * 100}% + ${dragOffset / (effectiveWidth || 1) * 100}%)) translateZ(0)`,
                        width: '100%'
                    }}
                >
                    <div className="flex h-full w-full flex-shrink-0">
                        {/* Panel 1: Search */}
                        <div className="w-full h-full flex-shrink-0 flex flex-col px-1 space-y-4 overflow-hidden">
                            <div className="relative flex-shrink-0">
                                <input 
                                    type="text" 
                                    placeholder="调谐全球电台频率..." 
                                    className="w-full h-16 rounded-2xl pl-14 pr-24 focus:outline-none transition-all border shadow-sm text-[16px]" 
                                    style={{ 
                                        backgroundColor: inputBg, 
                                        color: palette.primary, 
                                        borderColor: palette.surface === '#000000' ? '#222' : 'transparent',
                                    } as any} 
                                    value={query} 
                                    onChange={e => setQuery(e.target.value)} 
                                    onKeyDown={e => e.key === 'Enter' && searchStations(query)} 
                                />
                                <Icons.Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                                <button 
                                    onClick={() => searchStations(query)} 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 px-5 h-10 rounded-xl text-xs font-black uppercase tracking-widest active:scale-90 transition-all shadow-md" 
                                    style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}
                                >
                                    调谐
                                </button>
                            </div>
                            <div className="flex-1 space-y-px overflow-y-auto no-scrollbar pb-32">
                                {isSearching ? (
                                    <div className="text-center py-24 space-y-6 opacity-40 animate-pulse">
                                        <Icons.Radio className="w-16 h-16 mx-auto" />
                                        <div className="text-[12px] font-black uppercase tracking-[0.3em]">信号扫描中...</div>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((r: any, idx: number) => (
                                        <div 
                                            key={r.id + r.url} 
                                            onClick={() => { addStation(r); if (navigator.vibrate) navigator.vibrate(10); }} 
                                            className="flex items-center gap-5 p-5 border-b last:border-0 active:bg-white/5 active:scale-[0.98] transition-all group animate-fade-in" 
                                            style={{ borderColor: palette.border, animationDelay: `${idx * 15}ms` }}
                                        >
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border shadow-inner bg-white/5" style={{ borderColor: palette.border }}>
                                                {r.iconUrl ? <img src={r.iconUrl} className="w-full h-full object-cover" /> : <Icons.Radio className="w-full h-full p-3.5 opacity-10" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[16px] font-black truncate leading-snug">{r.name}</div>
                                                <div className="text-[10px] opacity-40 truncate uppercase font-bold tracking-tight" style={{ color: palette.textSecondary }}>{r.notes || '全球广播信号'}</div>
                                            </div>
                                            <div className="p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                                <Icons.Plus className="w-7 h-7" />
                                            </div>
                                        </div>
                                    ))
                                ) : query && !isSearching ? (
                                    <div className="text-center py-32 opacity-20 space-y-5">
                                        <div className="text-6xl">📡</div>
                                        <div className="text-[12px] font-black uppercase tracking-[0.2em]">未捕获到任何有效信号</div>
                                    </div>
                                ) : (
                                    <div className="text-center py-32 opacity-10 space-y-6">
                                        <Icons.Search className="w-20 h-20 mx-auto" />
                                        <div className="text-[14px] font-black uppercase tracking-[0.5em]">SCAN FOR STATIONS</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel 2: Manual */}
                        <div className="w-full h-full flex-shrink-0 px-2 overflow-y-auto no-scrollbar">
                            <div className="flex flex-col space-y-10 mt-4 pb-32">
                                <div className="space-y-3 px-1">
                                    <label className="text-[11px] font-black uppercase tracking-widest opacity-40 ml-2">频率识别标识</label>
                                    <input 
                                        placeholder="输入电台呼号或名称..." 
                                        className="w-full h-16 rounded-[24px] px-7 focus:outline-none transition-all border text-[18px]" 
                                        style={{ 
                                            backgroundColor: inputBg, 
                                            color: palette.primary, 
                                            borderColor: palette.surface === '#000000' ? '#222' : 'transparent', 
                                        } as any} 
                                        value={form.name} 
                                        onChange={e => setForm({ ...form, name: e.target.value })} 
                                    />
                                </div>
                                <div className="space-y-3 px-1">
                                    <label className="text-[11px] font-black uppercase tracking-widest opacity-40 ml-2">数据流 URL 地址</label>
                                    <input 
                                        placeholder="http://..." 
                                        className="w-full h-16 rounded-[24px] px-7 focus:outline-none transition-all border text-[14px] font-mono" 
                                        style={{ 
                                            backgroundColor: inputBg, 
                                            color: palette.primary, 
                                            borderColor: palette.surface === '#000000' ? '#222' : 'transparent', 
                                        } as any} 
                                        value={form.url} 
                                        onChange={e => setForm({ ...form, url: e.target.value })} 
                                    />
                                </div>
                                <div className="px-1">
                                    <button 
                                        onClick={() => { if (form.url) { addStation(form); setView('LIST'); if (navigator.vibrate) navigator.vibrate(12); } }} 
                                        className="w-full h-20 rounded-[32px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all text-[16px]" 
                                        style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}
                                    >
                                        建立信号连接
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Panel 3: Import */}
                        <div className="w-full h-full flex-shrink-0 px-2 flex flex-col overflow-y-auto no-scrollbar">
                            <div className="flex flex-col space-y-4 pt-4 pb-32 h-full min-h-[400px]">
                                <div className="flex-1 flex flex-col space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest opacity-40 ml-2 flex-shrink-0">M3U 频谱数据</label>
                                    <textarea 
                                        placeholder="#EXTM3U&#10;#EXTINF:-1,Station Name&#10;http://... " 
                                        className="flex-1 w-full rounded-[32px] p-8 focus:outline-none text-[13px] font-mono leading-relaxed resize-none border shadow-inner min-h-[200px]" 
                                        style={{ 
                                            backgroundColor: inputBg, 
                                            color: palette.primary, 
                                            borderColor: palette.surface === '#000000' ? '#222' : palette.border 
                                        }} 
                                        value={bulkText} 
                                        onChange={e => setBulkText(e.target.value)} 
                                    />
                                </div>
                                <div className="flex-shrink-0">
                                    <button 
                                        onClick={() => { const p = parseM3U(bulkText); if (p.length) { addStations(p); setView('LIST'); if (navigator.vibrate) navigator.vibrate(20); } }} 
                                        className="w-full h-20 rounded-[32px] font-black uppercase tracking-[0.25em] transition-all shadow-2xl active:scale-95 text-[16px]" 
                                        style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}
                                    >
                                        解析并导入波段
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            const res = await fetch(`https://all.api.radio-browser.info/json/stations/byname/${encodeURIComponent(q)}?limit=40`);
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
            setRemoteResults([]);
        } finally {
            setIsRemoteSearching(false);
        }
    };

    const palette = THEME_PALETTES[settings.themeColor as keyof typeof THEME_PALETTES] || THEME_PALETTES.purple;
    const inputBg_App = palette.surface === '#000000' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

    const filteredList = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return stations
            .filter(s => s.name.toLowerCase().includes(q))
            .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0) || b.addedAt - a.addedAt);
    }, [stations, searchQuery]);

    if (!hasAgreedPrivacy) {
        return (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-fade-in">
                <div className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl overflow-hidden" style={{ backgroundColor: THEME_PALETTES.purple.container }}>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-purple-50">
                            <Icons.Shield className="w-12 h-12 text-purple-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">隐私政策协议</h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            感谢您选择 Transistor。在开始使用之前，请务必阅读并同意我们的隐私政策，以了解我们如何保护您的数据。
                        </p>
                        <a href="https://agreement-drcn.hispace.dbankcloud.cn/index.html?lang=zh&agreementId=1845500060129849728" target="_blank" className="text-sm font-bold text-purple-600 underline decoration-purple-200 underline-offset-4">查看隐私政策详情</a>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => { safeStorage.setItem('transistor_privacy_agreed', 'true'); setHasAgreedPrivacy(true); }} className="w-full h-14 bg-purple-600 text-white rounded-3xl font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-transform">同意并进入</button>
                        <button onClick={() => { if (confirm('不同意隐私政策将无法使用本应用。确定要退出吗？')) { document.body.innerHTML = '<div style="height:100vh; display:flex; align-items:center; justify-content:center; background:#000; color:#fff; font-family:sans-serif; text-align:center; padding:20px;">已退出应用。请手动关闭此页面。</div>'; } }} className="w-full h-14 bg-slate-100 text-slate-600 rounded-3xl font-bold uppercase tracking-widest active:scale-95 transition-transform">不同意并退出</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col transition-colors duration-700 overflow-hidden" style={{ backgroundColor: palette.surface, color: palette.primary }}>
            <style>{`:root { --primary: ${palette.active || palette.primary}; }`}</style>
            <header className="h-16 px-4 flex items-center justify-between border-b backdrop-blur-xl z-50 sticky top-0 flex-shrink-0" style={{ borderColor: palette.border, backgroundColor: palette.surface === '#000000' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }}>
                <div className="flex items-center gap-3">
                    {currentView !== 'LIST' && <button onClick={() => { setCurrentView('LIST'); setSearchQuery(''); }} className="p-2 -ml-2"><Icons.ChevronLeft className="w-6 h-6" /></button>}
                    <h1 className="text-xl font-black uppercase tracking-tighter">{currentView === 'LIST' ? 'Transistor' : currentView === 'ADD' ? '发现' : '设置'}</h1>
                </div>
                {currentView === 'LIST' && (
                    <div className="flex gap-1">
                        <button onClick={() => { setCurrentView('ADD'); if (navigator.vibrate) navigator.vibrate(5); }} className="p-2 opacity-60"><Icons.Plus className="w-6 h-6" /></button>
                        <button onClick={() => setCurrentView('SETTINGS')} className="p-2 opacity-60"><Icons.Settings className="w-6 h-6" /></button>
                    </div>
                )}
            </header>
            <main className="flex-1 flex flex-col relative min-h-0">
                {currentView === 'LIST' && (
                    <div className="h-full flex flex-col overflow-y-auto no-scrollbar pb-32">
                        {stations.length > 0 && (
                            <div className="p-4 sticky top-0 z-10 border-b backdrop-blur-md" style={{ backgroundColor: palette.surface === '#000000' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)', borderColor: palette.border }}>
                                <div className="relative group">
                                    <Icons.Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all ${searchQuery ? 'opacity-100 scale-110' : 'opacity-30'}`} style={{ color: searchQuery ? (palette.active || palette.primary) : 'currentColor' }} />
                                    <input placeholder="搜索电台库..." className="w-full h-11 pl-11 pr-10 rounded-full text-sm focus:outline-none transition-all border group-focus-within:ring-2 group-focus-within:ring-primary/20" style={{ backgroundColor: inputBg_App, borderColor: palette.border, color: palette.primary }} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/10 transition-all opacity-40 hover:opacity-100"><Icons.X className="w-3.5 h-3.5" /></button>}
                                </div>
                            </div>
                        )}
                        {stations.length > 0 ? (
                            <div className="space-y-px">
                                {filteredList.length > 0 ? filteredList.map(s => (
                                    <StationItem key={s.url + s.addedAt} station={s} isActive={activeStation?.url === s.url} isPlaying={isPlaying} iconStyle={settings.iconStyle} palette={palette} onPlay={playStation} onToggleFavorite={(st: any) => setStations(prev => prev.map(item => item.url === st.url ? {...item, isFavorite: !item.isFavorite} : item))} onDelete={(st: any) => setStations(prev => prev.filter(item => item.url !== st.url))} />
                                )) : (
                                    <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 opacity-40">
                                        <div className="text-5xl mb-2">🔭</div>
                                        <div className="font-black uppercase tracking-widest text-[10px]">没有找到匹配的信号</div>
                                        <button onClick={() => setSearchQuery('')} className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">显示全部</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 mt-12">
                                <Icons.Radio className="w-32 h-32 opacity-5" />
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black tracking-tight">波段处于静默状态</h2>
                                    <p className="text-sm opacity-40">您的收音机还没有收藏任何频率</p>
                                </div>
                                <button onClick={() => setCurrentView('ADD')} className="px-12 py-5 rounded-full font-bold uppercase tracking-widest shadow-2xl transition-transform active:scale-95" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>探索电台</button>
                            </div>
                        )}
                    </div>
                )}
                {currentView === 'ADD' && <AddView palette={palette} setView={setCurrentView} addStation={(s: any) => { setStations(p => [...p, {...s, id: Date.now().toString(), isFavorite: false, addedAt: Date.now()}]); setCurrentView('LIST'); }} addStations={(list: any[]) => { setStations(p => [...p, ...list]); setCurrentView('LIST'); }} searchStations={searchStations} isSearching={isRemoteSearching} searchResults={remoteResults} />}
                {currentView === 'SETTINGS' && (
                    <div className="h-full overflow-y-auto p-6 space-y-10 animate-fade-in no-scrollbar">
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-2">视觉主题</h3>
                            <div className="grid grid-cols-4 gap-4 p-5 rounded-[40px]" style={{ backgroundColor: inputBg_App }}>
                                {Object.keys(THEME_PALETTES).map(c => (
                                    <button key={c} onClick={() => setSettings(s => ({ ...s, themeColor: c, ...(c !== 'black' ? { preferredLightTheme: c } : {}) }))} className={`aspect-square rounded-full border-4 transition-transform active:scale-90 ${settings.themeColor === c ? 'scale-110 border-white shadow-xl' : 'opacity-60 border-transparent'}`} style={{ backgroundColor: THEME_PALETTES[c as keyof typeof THEME_PALETTES].primary === '#FFFFFF' ? '#121212' : THEME_PALETTES[c as keyof typeof THEME_PALETTES].primary }} />
                                ))}
                            </div>
                        </section>
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-2">图标形状</h3>
                            <div className="flex gap-4 p-5 rounded-[40px]" style={{ backgroundColor: inputBg_App }}>
                                {['circle', 'square'].map(s => (
                                    <button key={s} onClick={() => setSettings({ ...settings, iconStyle: s })} className={`flex-1 py-4 rounded-3xl font-bold uppercase text-[10px] tracking-widest transition-all ${settings.iconStyle === s ? 'shadow-lg' : 'opacity-40'}`} style={{ backgroundColor: settings.iconStyle === s ? (palette.surface === '#000000' ? palette.border : '#FFFFFF') : 'transparent', color: palette.primary }}>{s === 'circle' ? '圆润' : '几何'}</button>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 px-2">数据管理</h3>
                            <div className="flex gap-4">
                                <button onClick={() => { const blob = new Blob([JSON.stringify(stations)], {type: 'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transistor_backup.json'; a.click(); }} className="flex-1 p-6 rounded-[32px] flex flex-col items-center gap-2 border active:scale-95 transition-transform" style={{ backgroundColor: inputBg_App, borderColor: palette.border }}><Icons.Download className="w-6 h-6" /><span className="text-[10px] font-bold">备份库</span></button>
                                <button onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.onchange = (e: any) => { const r = new FileReader(); r.onload = ev => { try { const data = JSON.parse(ev.target?.result as string); setStations(data); } catch(e) { alert("文件解析错误"); } }; r.readAsText(e.target.files[0]); }; i.click(); }} className="flex-1 p-6 rounded-[32px] flex flex-col items-center gap-2 border active:scale-95 transition-transform" style={{ backgroundColor: inputBg_App, borderColor: palette.border }}><Icons.Upload className="w-6 h-6" /><span className="text-[10px] font-bold">恢复库</span></button>
                            </div>
                        </section>
                        <p className="text-center text-[10px] font-black opacity-10 tracking-[0.5em] pt-12 pb-24 uppercase">Transistor Standing By</p>
                    </div>
                )}
            </main>
            {activeStation && currentView !== 'FULL_PLAYER' && (
                <div onClick={() => setCurrentView('FULL_PLAYER')} className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-3xl border-t flex items-center justify-between px-6 z-40 animate-slide-up shadow-[0_-10px_40px_rgba(0,0,0,0.1)]" style={{ backgroundColor: palette.surface === '#000000' ? 'rgba(18,18,18,0.92)' : 'rgba(255,255,255,0.92)', borderColor: palette.border }}>
                    <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-14 h-14 shadow-lg overflow-hidden flex-shrink-0 border-2 transition-all ${isPlaying ? 'scale-100' : 'scale-90 opacity-60'} ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-2xl'}`} style={{ borderColor: palette.border, backgroundColor: palette.surface }}>
                            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" /> : <Icons.Radio className="w-full h-full p-4 opacity-10" />}
                        </div>
                        <div className="min-w-0">
                            <div className="text-base font-black truncate leading-tight">{activeStation.name}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest animate-pulse" style={{ color: palette.active || palette.primary }}>{isLoading ? '连接频率中...' : 'Signal Online'}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <button onClick={e => { e.stopPropagation(); setIsTimerDialogOpen(true); }} className="relative opacity-50 active:scale-90 transition-transform"><Icons.Timer className="w-6 h-6" />{sleepTimer && <span className="absolute -top-2 -right-2 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>{sleepTimer}</span>}</button>
                        <button onClick={e => { e.stopPropagation(); if (navigator.vibrate) navigator.vibrate(5); isPlaying ? audioRef.current?.pause() : audioRef.current?.play(); }} className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>
                            <div className="flex items-center justify-center w-full h-full">{isPlaying ? <Icons.Pause className="w-7 h-7" /> : <Icons.Play className="w-7 h-7 ml-1" />}</div>
                        </button>
                    </div>
                </div>
            )}
            {currentView === 'FULL_PLAYER' && activeStation && (
                <div className="fixed inset-0 z-[100] flex flex-col p-8 animate-slide-up" style={{ backgroundColor: palette.surface }}>
                    <div className="flex justify-between items-center">
                        <button onClick={() => setCurrentView('LIST')} className="p-4 rounded-3xl" style={{ backgroundColor: inputBg_App }}><Icons.ChevronLeft className="w-6 h-6" /></button>
                        <div className="text-[11px] font-black uppercase tracking-[0.5em] opacity-30">Broadcasting</div>
                        <button className="p-4 opacity-30 active:opacity-100 transition-opacity" onClick={() => { if(confirm('确认从收音机中移除此电台？')) { setStations(prev => prev.filter(i => i.url !== activeStation.url)); setCurrentView('LIST'); setActiveStation(null); audioRef.current?.pause(); } }}><Icons.Trash className="w-6 h-6" /></button>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center gap-12">
                        <div className={`w-72 h-72 shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[10px] flex items-center justify-center overflow-hidden transform transition-all duration-1000 ${isPlaying ? 'scale-100' : 'scale-90 opacity-40'} ${settings.iconStyle === 'circle' ? 'rounded-full' : 'rounded-[64px]'}`} style={{ borderColor: palette.container, backgroundColor: palette.container }}>
                            {activeStation.iconUrl ? <img src={activeStation.iconUrl} className="w-full h-full object-cover" /> : <Icons.Radio className="w-28 h-28 opacity-5" />}
                        </div>
                        <div className="text-center space-y-3 px-4">
                            <h2 className="text-3xl font-black leading-tight truncate max-w-[320px]">{activeStation.name}</h2>
                            <p className="text-[11px] font-mono opacity-40 truncate max-w-[240px] mx-auto uppercase tracking-tighter">{activeStation.url}</p>
                        </div>
                        <div className="flex items-center gap-8">
                            <button onClick={() => { isPlaying ? audioRef.current?.pause() : audioRef.current?.play(); if (navigator.vibrate) navigator.vibrate(10); }} className="w-28 h-28 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all" style={{ backgroundColor: palette.active || palette.primary, color: '#FFFFFF' }}>
                                <div className="flex items-center justify-center w-full h-full">{isPlaying ? <Icons.Pause className="w-12 h-12" /> : <Icons.Play className="w-12 h-12 ml-2" />}</div>
                            </button>
                        </div>
                        <div className="w-full max-w-[240px] flex items-center gap-5 opacity-50">
                            <Icons.Volume2 className="w-6 h-6" />
                            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="flex-1 h-1.5 rounded-full appearance-none bg-current opacity-20 cursor-pointer" />
                        </div>
                    </div>
                </div>
            )}
            {isTimerDialogOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[200] flex items-end sm:items-center justify-center p-4 animate-fade-in" onClick={() => setIsTimerDialogOpen(false)}>
                    <div className="w-full max-w-sm rounded-[48px] p-8 shadow-2xl space-y-8" style={{ backgroundColor: palette.container }} onClick={e => e.stopPropagation()}>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black tracking-tight">自动休眠</h3>
                            <p className="text-xs opacity-40 font-bold uppercase tracking-widest">在指定时间后切断音频信号</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[15, 30, 45, 60, 120, 0].map(m => (
                                <button key={m} onClick={() => { setSleepTimer(m || null); setIsTimerDialogOpen(false); if (navigator.vibrate) navigator.vibrate(5); }} className={`h-16 rounded-[24px] font-black transition-all active:scale-95 ${sleepTimer === m && m !== 0 ? 'shadow-lg' : ''}`} style={{ backgroundColor: sleepTimer === m && m !== 0 ? (palette.active || palette.primary) : inputBg_App, color: sleepTimer === m && m !== 0 ? '#FFFFFF' : palette.primary }}>{m === 0 ? 'OFF' : `${m}m`}</button>
                            ))}
                        </div>
                        <button onClick={() => setIsTimerDialogOpen(false)} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Dismiss</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);