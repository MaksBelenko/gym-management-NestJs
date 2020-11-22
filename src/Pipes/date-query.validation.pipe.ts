import {
    BadRequestException, 
    PipeTransform,
} from '@nestjs/common';

export class DateQueryValidationPipe implements PipeTransform {
    transform(value: any) {
        const { start, end } = value;

        if (new Date(start) >= new Date(end)) {
            throw new BadRequestException(`\"start\" date should be more than \"end\" date; Requested start = ${start}, end = ${end}`);
        }

        return value;
    }
}
