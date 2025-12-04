export class DateHelper {
  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  static getStartOfTheCurrentYear(): Date {
    return DateHelper.getStartOfTheYear(DateHelper.getCurrentYear());
  }

  static getEndOfTheCurrentYear(): Date {
    return DateHelper.getEndOfTheYear(DateHelper.getCurrentYear());
  }

  static getStartOfTheYear(year: number): Date {
    return new Date(year, 0, 1);
  }

  static getEndOfTheYear(year: number): Date {
    return new Date(year, 11, 31);
  }

  static getDateOnlyString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
