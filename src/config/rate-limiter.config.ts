import { RateLimiterOptions } from 'nestjs-rate-limiter';
import { Pool } from 'pg';
import { typeOrmConfig } from './typeorm.config';

const postgresClient = new Pool({
    host: typeOrmConfig.host,
    port: typeOrmConfig.port,
    database: typeOrmConfig.database,
    user: typeOrmConfig.username,
    password: typeOrmConfig.password,
});


// check https://www.npmjs.com/package/nestjs-rate-limiter for more info
export const rateLimiterConfig: RateLimiterOptions = {
    type: 'Postgres',
    storeClient: postgresClient,
    tableName: 'rate_limiting', // not specifying this will create one table for each keyPrefix
    points: 1,
    duration: 10,
    keyPrefix: 'global', //default

    // for: 'Express',  //default
    // type: 'Postgres',
    // // keyPrefix: 'global',  //default
    // points: 4,
    // // pointsConsumed: 1,
    // // inmemoryBlockOnConsumed: 0,  // against DDoS attacks
    // duration: 1,
    // // blockDuration: 0,  // If positive number and consumed more than points in current duration, block for blockDuration seconds.
    // // inmemoryBlockDuration: 0,
    // // queueEnabled: false,  //It activates the queue mechanism, and holds the incoming requests for duration value.
    // // whiteList: [],
    // // blackList: [],
    // storeClient: postgresClient,
    // // // insuranceLimiter: undefined,
    // // // storeType: undefined,
    // dbName: typeOrmConfig.database,
    // tableName: 'rate-limiter',
    // tableCreated: false,
    // // clearExpiredByTimeout: undefined,
    // // execEvenly: false,
    // // execEvenlyMinDelayMs: undefined,
    // // indexKeyPrefix: {},
    // maxQueueSize: 100,
    // errorMessage: 'Rate limit exceeded',
    // // customResponseSchema: undefined,
};
