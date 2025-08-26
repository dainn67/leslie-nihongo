export const convertDateToDDMMYYYY = (input: Date | number | string, locale: string = 'en-GB'): string => {
  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === 'number') {
    date = new Date(input);
  } else if (typeof input === 'string') {
    const maybeNumber = Number(input);
    date = isNaN(maybeNumber) ? new Date(input) : new Date(maybeNumber);
  } else {
    throw new Error('Invalid input type for date conversion');
  }

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const normalizeDate = (date: Date) => {
  const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  normalized.setHours(0, 0, 0, 0);
  return normalized.getTime();
};
