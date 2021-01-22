import { registerAs } from "@nestjs/config";

export default registerAs('serverConfig', () => ({
    baseUrl: process.env.BASE_URL,
    port: process.env.PORT,
}));