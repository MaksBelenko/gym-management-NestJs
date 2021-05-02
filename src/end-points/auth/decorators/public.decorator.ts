import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublicRoute = (value: boolean = true) => SetMetadata(IS_PUBLIC_KEY, value);