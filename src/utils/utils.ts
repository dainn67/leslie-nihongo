export const convertDateToDDMMYYYY = (date: Date) => {
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
};

export const normalizeDate = (date: Date) => {
  const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  normalized.setHours(0, 0, 0, 0);
  return normalized.getTime();
};