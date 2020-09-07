import { IDateObject } from '../shared/date-object.model';

export class DateHelper {
    
    getUtcDate(date: Date): string {
        return date.toUTCString();
    }

    getIsoDate(dateObject: IDateObject): string {
        const date = new Date(dateObject.year, dateObject.month, dateObject.day, dateObject.hours, dateObject.minutes);
        return date.toISOString()
    }

    getEpochDate(dateObject: IDateObject): number {
        const date = new Date(dateObject.year, dateObject.month, dateObject.day, dateObject.hours, dateObject.minutes);
        return date.getTime();
    }



}