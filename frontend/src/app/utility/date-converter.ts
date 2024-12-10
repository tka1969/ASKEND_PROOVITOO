export function dateCustomFormatting(date: Date): string {
  const padStart = (value: number): string => value.toString().padStart(2, '0');
  return [padStart(date.getDate()),
         padStart(date.getMonth() + 1),
         date.getFullYear()].join('/');
}

export function datefromString(date: string): Date {

  try {
    const dateParts = date.split('/');
    return new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
  }
  catch {};

  try {
    const num: number = Date.parse(date);
    return new Date(num);
  }
  catch {};

  return new Date();
}
