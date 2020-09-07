import { DateHelper } from '../helpers/date.helper';

export interface IDateObject {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
}

export class UtcDateObject implements IDateObject {
    public year: number;
    public month: number;
    public day: number;
    public hours: number;
    public minutes: number;

    constructor();
    constructor(passedDate?: Date) {
        var date = passedDate || new Date();
        this.year = date.getUTCFullYear();
        this.month = date.getUTCMonth();
        this.day = date.getUTCDay();
        this.hours = date.getUTCHours();
        this.minutes = date.getUTCMinutes();
    }

    toIsoString(): string {
        const dateHelper = new DateHelper();
        return dateHelper.getIsoDate(this);
    }
}