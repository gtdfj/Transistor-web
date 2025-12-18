
export interface Station {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  notes?: string;
  isFavorite: boolean;
  addedAt: number;
}

export type ViewState = 'LIST' | 'ADD' | 'SETTINGS' | 'FULL_PLAYER';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  showStreamUrl: boolean;
  iconStyle: 'circle' | 'square';
  sleepTimerAction: 'pause' | 'close';
  resumePlayback: 'never' | 'always' | 'ask';
  networkType: 'any' | 'wifi';
}

export interface RadioBrowserStation {
  changeuuid: string;
  name: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  country: string;
  language: string;
  bitrate: number;
}
