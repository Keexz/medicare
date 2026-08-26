import type { Appointment } from '@/types';

/** Hourly booking slots, 09:00–16:00 inclusive (constraint #9). */
export const BOOKING_TIMES = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
] as const;

/** Number of future days selectable in the booking flow (constraint #9). */
export const BOOKING_WINDOW_DAYS = 14;

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function toDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/** Next non-weekend day on or after the given date. */
export function toNextWeekday(date: Date): Date {
  let result = date;
  while (isWeekend(result)) {
    result = addDays(result, 1);
  }
  return result;
}

/**
 * The selectable booking window: starts today, spans BOOKING_WINDOW_DAYS
 * calendar days, weekend entries included so the UI can disable them.
 */
export function getBookingWindow(from: Date = new Date()): Date[] {
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) =>
    addDays(from, i),
  );
}

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** `"2026-08-25"` → `"Tue 25 Aug"` (locale-independent, demo-stable). */
export function formatDateShort(dateISO: string): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAY_NAMES[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

/** `"2026-08-25"` → `"Tuesday, August 25, 2026"` for detail views. */
export function formatDateLong(dateISO: string): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** `"14:00"` → `"2:00 PM"` */
export function formatTime(time: string): string {
  const [h, min] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(min).padStart(2, '0')} ${period}`;
}

/** Two-line chip content for the date picker: `{ weekday: "Mon", dayMonth: "25 Aug" }`. */
export function getDateChipParts(dateISO: string): { weekday: string; dayMonth: string } {
  const [y, m, d] = dateISO.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return {
    weekday: WEEKDAY_NAMES[date.getDay()],
    dayMonth: `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`,
  };
}

/** True when the slot's calendar day has not passed yet. */
export function isUpcoming(appointment: Appointment, now: Date = new Date()): boolean {
  const [y, m, d] = appointment.dateISO.split('-').map(Number);
  const apptDay = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return apptDay.getTime() >= today.getTime();
}
