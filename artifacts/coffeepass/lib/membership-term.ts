export function addOneCalendarMonth(start: Date) {
  const end = new Date(start);
  const originalDay = end.getUTCDate();

  end.setUTCDate(1);
  end.setUTCMonth(end.getUTCMonth() + 1);

  const lastDayOfTargetMonth = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0),
  ).getUTCDate();
  end.setUTCDate(Math.min(originalDay, lastDayOfTargetMonth));

  return end;
}
