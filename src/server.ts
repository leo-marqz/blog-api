
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom Modules
 */ 
import config from './config';
import limiter from './lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import { logger } from './lib/winston';

/**
 * Router
 */ 
import v1Router from './routes/v1';

/**
 * Types
 */ 
import type { CorsOptions } from 'cors';

/**
 * Express app initial
 */ 
const app = express();

/**
 * Configure CORS options
 */
const corsOptions: CorsOptions = {
    origin: (origin, callback)=> {
        if( config.NODE_ENV === 'development' 
            || !origin || 
            config.WHITELIST_ORIGINS.includes(origin) 
        ){
            callback(null, true);
            logger.info(`CORS Ok: ${origin} is allowed by CORS`);
        }else{
            // Reject requests from non-whitelisted origins
            callback( new Error(`CORS Error: ${origin} is not allowed by CORS`), false );
            logger.warn(`CORS Error: ${origin} is not allowed by CORS`);
        }
    }
} 

/**
 * Apply CORS Middleware
 */
app.use( cors( corsOptions ) );

/**
 * Enable JSON request body parsing
 */
app.use( express.json() ); 

/**
 * Enable URL-Encodeed request body parsing with extended mode
 * `extended: true` allows rich objects and arrays via querystring library
 */
app.use( express.urlencoded({ extended: true }) );

/**
 * Enable Cookie Parser
 */
app.use( cookieParser() );

/**
 * Enable response compression to reduce payload size improve performance
 */
app.use( 
    compression({
        threshold: 1024, // Only compress responses larger than 1KB
    }) 
);
/**
 * Use Helmet to enhance security by setting various HTTP headers
 */
app.use( helmet() );

/**
 * Apply rate limiting middleware to prevent excessive requests and enhance security
 */
app.use( limiter );

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server.
 * 
 * - Tries to connect to the datase before initializing the server.
 * - Defines the API router ('/api/v1').
 * - Starts the server on the specified  PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process exits with status 1.
 */
(async ()=>{
    try{

        // Connect to the database before starting the server
        await connectToDatabase();

        app.use('/api/v1', v1Router);

        app.listen(config.PORT, ()=>{
            logger.info(`Server is running: http://localhost:${config.PORT}`);
        });
        
    }catch(error){
        logger.error(`failed to start the server`, error);

        if( config.NODE_ENV === 'production' ){
            process.exit(1);
        }
    }
})();


/**
 * Handles server shutdown gracefully by disconnecting from the database.
 * 
 * - Attempts to disconnect from the database before shutting down the server.
 * - logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exits the process with status code `0` (indicating a successful shutdown).
 */

const handleServerShutdown = async ()=>{
    try{
        await disconnectFromDatabase();
        logger.warn(`[SIGTERM] Shutting down server...`);
        process.exit(0);
    }catch(error){
        logger.error(`[SIGINT] Error during server shutdown...`, error);
    }
}

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`).
 * 
 * - `SIGTERM` is typically sent when stopping a process (e.g, `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupts the process (e.g., processing `Ctrl + C`).
 * - When either signal is received, 'handleServerShutdown` is executed to ensure proper cleanup.
 */

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);


