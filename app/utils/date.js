import { DateTime } from "luxon";

export function isoToNiceDate(isoDate) {
  return DateTime.fromISO(isoDate)
    .setLocale("en-AU")
    .toLocaleString(DateTime.DATE_SHORT);
}

export function isoToMonthYear(isoDate) {
  return DateTime.fromISO(isoDate).setLocale("en-AU").toFormat("MMMM yyyy");
}
