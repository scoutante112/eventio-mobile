export interface EventSummary {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  start_date: string;
  end_date: string;
  logo_url: string;
  color_primary: string;
  color_secondary: string;
  api_base: string;
}

export interface EventFeatures {
  enable_funkis: boolean;
  show_schema: boolean;
  show_matsedel: boolean;
  show_karta: boolean;
  show_info: boolean;
}

export interface EventDetail {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  location: string;
  start_date: string;
  end_date: string;
  logo_url: string;
  color_primary: string;
  color_secondary: string;
  welcome_text?: string;
  features: EventFeatures;
}

export interface NewsItem {
  id: number;
  title: string;
  body: string;
  published_at: string;
  image_url?: string;
}

export interface ScheduleItem {
  id: number;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time?: string;
  day?: string;
}

export interface MatsedelItem {
  id: number;
  meal: string;
  description?: string;
  date?: string;
  time?: string;
}

export interface InfoSection {
  id: number;
  title: string;
  body: string;
}

export type UserRole = 'deltagare' | 'funkis';

export type RootStackParamList = {
  Home: undefined;
  RoleSelect: { event: EventSummary };
  EventTabs: { event: EventSummary; role: UserRole };
};

export type EventTabParamList = {
  News: { event: EventSummary; role: UserRole };
  Schedule: { event: EventSummary; role: UserRole };
  Matsedel: { event: EventSummary; role: UserRole };
  Karta: { event: EventSummary; role: UserRole };
  Info: { event: EventSummary; role: UserRole };
};
