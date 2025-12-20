
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */

import winston from 'winston';

/**
 * Custom Modules
 */
import config from '../config';

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

// Define the transports array to hold different logging transports
const transports: winston.transport[] = [];

// If the application is not running in production, add a console transport
if(config.NODE_ENV !== 'production'){
    transports.push(new winston.transports.Console({
        format: combine(
            colorize({ all: true }), // Add colors to log levels
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }), // Add timestamp to logs
            align(),
            printf(({timestamp, level, message, ...meta})=>{

                const metaStr = Object.keys(meta).length 
                                    ? `\n${JSON.stringify(meta, null, 2)}` 
                                    : '';

                return `${timestamp} [${level}]: ${message} ${metaStr}`;
            })
        )
    }))
}

// Create a logger instance using Winston
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info', // Set the default logging leve to 'info'
    format: combine(timestamp(), errors({ stack: true}), json() ), // Use JSON format for log message
    transports: transports, // Add the defined transports to the logger
    silent: config.NODE_ENV === 'test', // Disable logging in test environment.
});
 
export { logger };