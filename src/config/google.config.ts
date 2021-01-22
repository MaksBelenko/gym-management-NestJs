import { registerAs } from "@nestjs/config";

export default registerAs('google', () => ({
    clientId: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_SECRET,
}));