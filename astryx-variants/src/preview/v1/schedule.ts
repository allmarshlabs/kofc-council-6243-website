// Derives real upcoming meeting dates from the rhythm in content.ts:
// Knights on the 1st and 3rd Mondays, Ladies Auxiliary on the 4th Monday.

export type Meeting = {date: Date; group: 'Knights' | 'Ladies Auxiliary'; nth: number};

function nthMonday(year: number, month: number, nth: number): Date {
  const first = new Date(year, month, 1);
  const offset = (8 - first.getDay()) % 7; // days until first Monday
  return new Date(year, month, 1 + offset + (nth - 1) * 7);
}

export function upcomingMeetings(count: number, from = new Date()): Meeting[] {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const out: Meeting[] = [];
  for (let m = 0; out.length < count && m < 24; m++) {
    const year = today.getFullYear();
    const month = today.getMonth() + m;
    const monthMeetings: Meeting[] = [
      {date: nthMonday(year, month, 1), group: 'Knights', nth: 1},
      {date: nthMonday(year, month, 3), group: 'Knights', nth: 3},
      {date: nthMonday(year, month, 4), group: 'Ladies Auxiliary', nth: 4},
    ];
    for (const meeting of monthMeetings) {
      if (meeting.date >= today && out.length < count) out.push(meeting);
    }
  }
  return out;
}

export const ordinal = (n: number) => ['First', 'Second', 'Third', 'Fourth'][n - 1];

export const formatLong = (d: Date) =>
  d.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});

export const formatShort = (d: Date) =>
  d.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'});

export const formatMonthDay = (d: Date) =>
  d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
