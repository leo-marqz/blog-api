
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

// Node Modules
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

// Custom Modules
import config from './config';
import limiter from './lib/express_rate_limit';

// Types
import type { CorsOptions } from 'cors';

// Express app initial
const app = express();

//Configure CORS options
const corsOptions: CorsOptions = {
    origin: (origin, callback)=> {
        if( config.NODE_ENV === 'development' 
            || !origin || 
            config.WHITELIST_ORIGINS.includes(origin) 
        ){
            callback(null, true);
            console.log(`CORS Accepted: ${origin}`);
        }else{
            // Reject requests from non-whitelisted origins
            callback( new Error(`CORS Error: ${origin} is not allowed by CORS`), false );
            console.log(`CORS Error: ${origin} is not allowed by CORS`);
        }
    }
} 

// Apply CORS Middleware
app.use( cors( corsOptions ) );

// Enable JSON request body parsing
app.use( express.json() ); 

// Enable URL-Encodeed request body parsing with extended mode
// `extended: true` allows rich objects and arrays via querystring library
app.use( express.urlencoded({ extended: true }) );

app.use( cookieParser() );

// Enable response compression to reduce payload size improve performance
app.use( 
    compression({
        threshold: 1024, // Only compress responses larger than 1KB
    }) 
);

// Use Helmet to enhance security by setting various HTTP headers
app.use( helmet() );

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use( limiter );

(async ()=>{
    try{
        //Router
        app.get('', (req, res)=>{
            res.json({
                id: 1,
                name: 'leomarqz',
                nickname: '::crack::night::'
            })
        })
        
        // Express server listening...
        app.listen(config.PORT, ()=>{
            console.log(`Server is running: http://localhost:${config.PORT}`);
        });
    }catch(error){
        console.log(`failed to start the server`, error);

        if( config.NODE_ENV === 'production' ){
            process.exit(1);
        }
    }
})();


