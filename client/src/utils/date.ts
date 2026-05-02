export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const isToday = (isoDateString?: string): boolean => {
  if (!isoDateString) return false;
  return isoDateString.split("T")[0] === getTodayISO();
};

export const filterToday = <T extends { createdAt?: string }>(
  items: T[],
): T[] => {
  return items.filter((item) => isToday(item.createdAt));
};
