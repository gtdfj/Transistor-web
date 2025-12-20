
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

export type ThemeColor = 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'black';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  themeColor: ThemeColor;
  showStreamUrl: boolean;
  iconStyle: 'circle' | 'square';
  sleepTimerAction: 'pause' | 'stop';
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
