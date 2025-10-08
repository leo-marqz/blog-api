
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'production',
    WHITELIST_ORIGINS: ['https://dosc.blog-apileomarqz.com'],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
}

export default config;