import { useQuery } from '@tanstack/react-query';
import { api, InfoPage, getApiBase } from '../lib/api';
import { useEventStore } from '../stores/eventStore';

export function useInfo() {
  const slug = useEventStore((s) => s.slug);
  return useQuery<InfoPage[]>({
    queryKey: ['info', slug],
    queryFn: async () => {
      const res = await api.get<InfoPage[]>('/info', { baseURL: getApiBase(slug!) });
      return res.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
