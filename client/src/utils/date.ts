export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const toISODate = (isoDateString?: string): string | null => {
  if (!isoDateString) return null;
  return isoDateString.split("T")[0];
};

export const isToday = (isoDateString?: string): boolean => {
  return toISODate(isoDateString) === getTodayISO();
};

export const filterByDate = <T extends { createdAt?: string }>(
  items: T[],
  dateString: string,
): T[] => {
  return items.filter((item) => toISODate(item.createdAt) === dateString);
};

export const filterToday = <T extends { createdAt?: string }>(
  items: T[],
): T[] => {
  return filterByDate(items, getTodayISO());
};