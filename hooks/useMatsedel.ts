import { useQuery } from '@tanstack/react-query';
import { api, MealEntry, getApiBase } from '../lib/api';
import { useEventStore } from '../stores/eventStore';

export function useMatsedel() {
  const slug = useEventStore((s) => s.slug);
  return useQuery<MealEntry[]>({
    queryKey: ['matsedel', slug],
    queryFn: async () => {
      const res = await api.get<MealEntry[]>('/matsedel', { baseURL: getApiBase(slug!) });
      return res.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
