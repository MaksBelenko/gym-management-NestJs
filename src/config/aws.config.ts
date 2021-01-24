import { registerAs } from '@nestjs/config';

export default registerAs('awsConnectionConfig', () => ({
    // process.env.AWS_ACCESS_KEY_ID,
    // process.env.AWS_SECRET_ACCESS_KEY,
    // process.env.AWS_REGION,
    photosBucketName: process.env.AWS_PHOTOS_BUCKET_NAME,
}));
