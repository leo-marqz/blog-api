
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */

import dotenv from 'dotenv';

/**
 * Types
 */
import ms from 'ms';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'production',
    WHITELIST_ORIGINS: ['https://dosc.blog-api.leomarqz.com', 'http://localhost'],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY! as ms.StringValue,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY! as ms.StringValue
}

export default config;