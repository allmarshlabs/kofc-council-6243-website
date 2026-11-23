// Real meeting dates derived from the standing rule in content.ts:
// Knights meet on the first and third Mondays, the Ladies Auxiliary on the
// fourth Monday of each month. Nothing here is invented — only computed.
import { meetings } from '../../shared/content';

export type Group = 'Knights' | 'Ladies Auxiliary';

export type Meeting = {
  id: string;
  date: Date;
  title: string;
  group: Group;
  /** "First Monday", "Third Monday", "Fourth Monday" */
  rule: string;
  month: string;
};

const ORDINAL = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

function nthMonday(year: number, month: number, n: number): Date {
  const first = new Date(year, month, 1);
  const offset = (8 - first.getDay()) % 7; // days until the first Monday
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

export function upcomingMeetings(months = 6, from = new Date()): Meeting[] {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const out: Meeting[] = [];
  for (let i = 0; i <= months; i++) {
    const y = from.getFullYear();
    const m = from.getMonth() + i;
    const plan: [number, Group, string][] = [
      [1, 'Knights', meetings[0].title],
      [3, 'Knights', meetings[0].title],
      [4, 'Ladies Auxiliary', meetings[1].title],
    ];
    for (const [n, group, title] of plan) {
      const date = nthMonday(y, m, n);
      if (date < today) continue;
      out.push({
        id: date.toISOString().slice(0, 10) + group,
        date,
        title,
        group,
        rule: `${ORDINAL[n - 1]} Monday`,
        month: monthFmt.format(date),
      });
    }
  }
  out.sort((a, b) => a.date.getTime() - b.date.getTime());
  // Keep whole months only: stop after `months` distinct months.
  const ordered = [...new Set(out.map((x) => x.month))].slice(0, months);
  return out.filter((x) => ordered.includes(x.month));
}

export const formatDay = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(d);

export const formatShort = (d: Date) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(d);

export const isToday = (d: Date, now = new Date()) =>
  d.getFullYear() === now.getFullYear() &&
  d.getMonth() === now.getMonth() &&
  d.getDate() === now.getDate();

/** Every meeting in the current calendar month, past ones included. */
export function meetingsThisMonth(now = new Date()): Meeting[] {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return upcomingMeetings(1, start).filter((m) => m.date.getMonth() === now.getMonth());
}
