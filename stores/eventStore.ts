import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventConfig, EventListing, Role } from '../lib/api';

interface EventStore {
  slug: string | null;
  role: Role | null;
  eventData: EventConfig | null;
  eventListing: EventListing | null;
  setSlug: (slug: string) => void;
  setRole: (role: Role) => void;
  setEventData: (data: EventConfig) => void;
  setEventListing: (listing: EventListing) => void;
  reset: () => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      slug: null,
      role: null,
      eventData: null,
      eventListing: null,
      setSlug: (slug) => set({ slug }),
      setRole: (role) => set({ role }),
      setEventData: (eventData) => set({ eventData }),
      setEventListing: (eventListing) => set({ eventListing }),
      reset: () => set({ slug: null, role: null, eventData: null, eventListing: null }),
    }),
    {
      name: 'eventio-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        slug: state.slug,
        role: state.role,
      }),
    },
  ),
);
