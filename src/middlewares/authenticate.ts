
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/**
 * Custom Modules
 */
import { logger } from "../lib/winston";
import { verifyAccessToken } from "../lib/jwt";

/**
 * Types
 */
import type { Request, Response, NextFunction } from "express";
import type { Types } from "mongoose";

/**
 * @function authenticate
 * @description Middleware to verify the user's access token from the Authorization header. If the token is valid, the user's Id is attached to the request object. Otherwise, it returns an appropriate error response.
 * @param {Request} req - Express Request object. Expects a Bearer token in the Authorization header.
 * @param {Response} res - Express Response object used to send error responses if authentication fails. 
 * @param {NextFunction} next - Express NextFunction to pass control to the next middleware.
 * 
 * @returns {void}
 */
const authenticate = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization;

    // If there's no Bearer token, respond with 401 Unauthorized
    if(!authHeader?.startsWith('Bearer ')){
        res.status(401).json({
            code: 'AuthenticationError',
            message: 'Access denied, no token provided' 
        });
        return;
    }

    // Split out the token from the 'Bearer ' prefix
    const [, token] = authHeader.split(' ');

    try{
        // verify the token and extract the userId from the payload
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

        // Attach the userId to the request object for later use 
        // (Custom) userId is defined in src/@types/express/index.ts
        // (tsconfig.json paths updated to include src/@types)
        req.userId = jwtPayload.userId; //access all endpoints

        // Proceed to the next middleware or route handler
        return next();

    }catch(error){
        // Handle expired token error
        if(error instanceof TokenExpiredError){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token expired, request a new with refresh token!'
            });
            return;
        }

        // Handle invalid token error
        if(error instanceof JsonWebTokenError){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Access token invalid!'
            });
            return;
        }

        // Catch-all for other errors
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error!',
            error: error
        });

        logger.error('Error during authentication', error );
    }
}

export default authenticate;