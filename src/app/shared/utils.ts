export function removeSpecialCharacterFromString(text: string) {
  return text.replace(/[\_ -]+/g, ' ');
}

export function getNumberOfDays(fromDate: Date, toDate: Date) {
  if (isSameDate(fromDate, toDate)) {
    return 1;
  } else {
    const differenceInTime = Math.abs(fromDate.getTime() - toDate.getTime());
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  }
}

export function isSameDate(fromDate: Date, toDate: Date) {
  return fromDate.toDateString() === toDate.toDateString();
}

export function generateSlug(slug: string) {
  if (isDefinedAndNotNull(slug)) {
    return slug.replace(/\s/g, '-').toLowerCase();
  }
}

export function isDefinedAndNotNull(variable: any) {
  return variable !== undefined && variable !== null;
}

export function isEmptyObject(obj: any) {
  return obj && Object.keys(obj).length === 0;
}

export function sanitizeParams(params: { [key: string]: string | number | boolean }) {
  const newParam = Object.entries(params).map(param => {
    if (isDefinedAndNotNull(param['1'])) {
      return param.join('=');
    }
  });
  return newParam.filter(p => p !== undefined).join('&');
}

export function intToOrdinalNumberString(num: number) {
  num = Math.round(num);
  let numString = num.toString();

  // If the ten's place is 1, the suffix is always "th"
  // (10th, 11th, 12th, 13th, 14th, 111th, 112th, etc.)
  if (Math.floor(num / 10) % 10 === 1) {
    return numString + 'th';
  }

  // Otherwise, the suffix depends on the one's place as follows
  // (1st, 2nd, 3rd, 4th, 21st, 22nd, etc.)
  switch (num % 10) {
    case 1:
      return numString + 'st';
    case 2:
      return numString + 'nd';
    case 3:
      return numString + 'rd';
    default:
      return numString + 'th';
  }
}
