import {
  EventSummary,
  EventDetail,
  NewsItem,
  ScheduleItem,
  MatsedelItem,
  InfoSection,
  UserRole,
} from '../types';

const MAIN_API = 'https://api.eventio.se';

async function get<T>(url: string): Promise<T> {
  console.log('[API] GET', url);
  try {
    const res = await fetch(url);
    console.log('[API] Response', url, '->', res.status, res.headers.get('content-type'));
    if (!res.ok) {
      const body = await res.text();
      console.log('[API] Error body:', body.slice(0, 200));
      throw new Error(`HTTP ${res.status} — ${url}`);
    }
    const json = await res.json();
    console.log('[API] OK', url, '-> keys:', Object.keys(json));
    return json;
  } catch (e) {
    console.log('[API] FAIL', url, e instanceof Error ? `${e.name}: ${e.message}` : e);
    throw e;
  }
}

export async function fetchEvents(): Promise<EventSummary[]> {
  const data = await get<{ events: EventSummary[] }>(`${MAIN_API}/events`);
  console.log('events api_base values:', data.events.map(e => e.api_base));
  return data.events;
}

export async function fetchEventDetail(apiBase: string): Promise<EventDetail> {
  return get<EventDetail>(`${apiBase}/api/event`);
}

export async function fetchNews(apiBase: string): Promise<NewsItem[]> {
  const data = await get<{ news: NewsItem[] } | NewsItem[]>(`${apiBase}/api/news`);
  return Array.isArray(data) ? data : data.news ?? [];
}

export async function fetchSchedule(
  apiBase: string,
  role: UserRole,
): Promise<ScheduleItem[]> {
  const data = await get<{ schedule: ScheduleItem[] } | ScheduleItem[]>(
    `${apiBase}/api/schedule?role=${role}`,
  );
  return Array.isArray(data) ? data : data.schedule ?? [];
}

export async function fetchMatsedel(apiBase: string): Promise<MatsedelItem[]> {
  const data = await get<{ matsedel: MatsedelItem[] } | MatsedelItem[]>(
    `${apiBase}/api/matsedel`,
  );
  return Array.isArray(data) ? data : data.matsedel ?? [];
}

export async function fetchInfo(apiBase: string): Promise<InfoSection[]> {
  const data = await get<{ info: InfoSection[] } | InfoSection[]>(
    `${apiBase}/api/info`,
  );
  return Array.isArray(data) ? data : data.info ?? [];
}

export async function fetchVapidKey(apiBase: string): Promise<string> {
  const data = await get<{ key: string }>(`${apiBase}/api/vapid-public-key`);
  return data.key;
}

export async function subscribePush(
  apiBase: string,
  endpoint: string,
  p256dh: string,
  auth: string,
  role: UserRole,
): Promise<void> {
  await fetch(`${apiBase}/api/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, keys: { p256dh, auth }, role }),
  });
}

export async function unsubscribePush(
  apiBase: string,
  endpoint: string,
): Promise<void> {
  await fetch(`${apiBase}/api/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint }),
  });
}
