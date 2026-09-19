export interface ChannelItem {
  id: string;
  cid: string;
  tid: string;
  title: string;
  remotetv: string;
  logo: string;
  favorite: boolean;
  category?: string;
  streamUrl?: string;
  custom?: boolean;
}

export interface Category {
  id: string;
  title: string;
  subid?: string;
  icon?: string;
}

export interface Program {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  description?: string;
  durationMinutes: number;
}

export interface ChannelWithSchedule extends ChannelItem {
  currentProgram?: Program;
  nextProgram?: Program;
  schedule?: Program[];
}

export type ViewMode = 'normal' | 'tv' | 'tv-compact';

export type AspectRatio = '16:9' | '4:3' | 'fill' | 'contain';
