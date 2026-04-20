import { useQuery } from '@tanstack/react-query';
import { api, ScheduleEntry, Role, getApiBase } from '../lib/api';
import { useEventStore } from '../stores/eventStore';

export function useSchedule() {
  const slug = useEventStore((s) => s.slug);
  const role = useEventStore((s) => s.role) ?? 'deltagare';

  return useQuery<ScheduleEntry[]>({
    queryKey: ['schedule', slug, role],
    queryFn: async () => {
      const res = await api.get<ScheduleEntry[]>('/schedule', {
        baseURL: getApiBase(slug!),
      });
      // Filter: show entries visible to 'all' or the current role
      return res.data.filter(
        (e) => e.visible_to === 'all' || e.visible_to === role,
      );
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
