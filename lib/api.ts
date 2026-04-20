import axios from 'axios';
import { useEventStore } from '../stores/eventStore';

export const EVENTS_API = 'https://api.eventio.se/events';

export function getApiBase(slug: string) {
  return `https://${slug}.eventio.se/api`;
}

// Axios instance — baseURL set dynamically before each call
export const api = axios.create({ timeout: 10000 });

api.interceptors.request.use((config) => {
  const slug = useEventStore.getState().slug;
  if (slug && !config.url?.startsWith('http')) {
    config.baseURL = getApiBase(slug);
  }
  return config;
});

// Types
export interface EventListing {
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
}

export interface EventConfig {
  name: string;
  tagline: string;
  start_date: string;
  end_date: string;
  location: string;
  color_primary: string;
  color_secondary: string;
  logo_url?: string;
  features: {
    schema: boolean;
    matsedel: boolean;
    karta: boolean;
    info: boolean;
  };
  welcome_deltagare: string;
  welcome_funkis: string;
}

export interface NewsItem {
  id: number;
  title: string;
  body: string;
  created_at: string;
  author: string;
}

export interface ScheduleEntry {
  id: number;
  event_date: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
  location: string;
  category: string;
  visible_to: 'all' | 'funkis' | 'deltagare';
}

export interface MealEntry {
  id: number;
  meal_date: string;
  meal_type: 'frukost' | 'lunch' | 'middag' | 'fika' | 'annat';
  title: string;
  description: string;
  allergens: string;
}

export interface InfoPage {
  title: string;
  content: string;
}

export type Role = 'deltagare' | 'funkis';
