// Real meeting dates derived from the schedule in content.ts:
// Knights meet on the 1st and 3rd Mondays, the Ladies Auxiliary on the 4th.
import { meetings } from '../shared/content';

export type MeetingKind = 'knights' | 'auxiliary';
export type MeetingDate = { date: Date; iso: string; kind: MeetingKind; title: string; ordinal: string };

const ORDINALS = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth'];

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Which Monday of its month a date is (1-5), or 0 if not a Monday. */
export const mondayIndex = (d: Date) => (d.getDay() === 1 ? Math.ceil(d.getDate() / 7) : 0);

export const meetingKind = (d: Date): MeetingKind | null => {
  const n = mondayIndex(d);
  if (n === 1 || n === 3) return 'knights';
  if (n === 4) return 'auxiliary';
  return null;
};

export const isMeetingDay = (d: Date) => meetingKind(d) !== null;

/** The next `count` meeting dates, starting today. */
export function upcomingMeetings(count: number, from = startOfToday()): MeetingDate[] {
  const out: MeetingDate[] = [];
  const d = new Date(from);
  while (out.length < count) {
    const kind = meetingKind(d);
    if (kind) {
      out.push({
        date: new Date(d),
        iso: toISO(d),
        kind,
        title: kind === 'knights' ? meetings[0].title : meetings[1].title,
        ordinal: `${ORDINALS[mondayIndex(d)]} Monday`,
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export const nextOf = (kind: MeetingKind) => upcomingMeetings(6).find((m) => m.kind === kind)!;

export const formatLong = (d: Date) =>
  d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/** "Today", "Tomorrow" or "In N days". */
export function relative(d: Date, from = startOfToday()) {
  const days = Math.round((d.getTime() - from.getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}
