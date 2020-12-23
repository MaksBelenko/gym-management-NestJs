import { IDateObject } from '../shared/date-object.model';

export class DateHelper {
    
    convertToUtc(isoDateString: string): Date {
        const date = new Date(isoDateString);
        const numberUTC = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                                    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return new Date(numberUTC);
    }

    getUtcDate(date: Date): string {
        return date.toUTCString();
    }

    getIsoDate(dateObject: IDateObject): string {
        const date = new Date(dateObject.year, dateObject.month, dateObject.day, dateObject.hours, dateObject.minutes);
        return date.toISOString()
    }

    getEpochDate(dateObject: IDateObject): number {
        const date = new Date(dateObject.year, dateObject.month, dateObject.day, dateObject.hours, dateObject.minutes);
        return 	Math.floor(new Date().getTime()/1000.0);
    }



}