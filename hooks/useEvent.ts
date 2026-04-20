import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api, EventConfig, getApiBase } from '../lib/api';
import { useEventStore } from '../stores/eventStore';

export function useEvent() {
  const { slug, setEventData } = useEventStore();

  const query = useQuery<EventConfig>({
    queryKey: ['event', slug],
    queryFn: async () => {
      const res = await api.get<EventConfig>('/event', {
        baseURL: getApiBase(slug!),
      });
      return res.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (query.data) setEventData(query.data);
  }, [query.data]);

  return query;
}
