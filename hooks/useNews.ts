import { useQuery } from '@tanstack/react-query';
import { api, NewsItem, getApiBase } from '../lib/api';
import { useEventStore } from '../stores/eventStore';

export function useNews() {
  const slug = useEventStore((s) => s.slug);
  return useQuery<NewsItem[]>({
    queryKey: ['news', slug],
    queryFn: async () => {
      const res = await api.get<NewsItem[]>('/news', { baseURL: getApiBase(slug!) });
      return res.data;
    },
    enabled: !!slug,
    staleTime: 30 * 1000,
    retry: 2,
  });
}
