
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { rateLimit } from 'express-rate-limit';

/**
 * Confgiure rate limiting middleware to prevent abuse
 */ 
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1-minute time window for request limiting
    max: 60, // Allow a maximun of 60 reequests per window per IP
    standardHeaders: 'draft-8', // Use the latest standard rate-limit headers 
    legacyHeaders: false, // Disable deprecated X-RateLimit headers 
    message: {
        error: 'You have sent too many requests in given amount of time. Please try again later.',
        // code: 'TOO_MANY_REQUESTS'
    }
});

export default limiter;
