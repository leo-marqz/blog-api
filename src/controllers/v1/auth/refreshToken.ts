
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

/**
 * Custom Modules
 */
import { logger } from '../../../lib/winston';
import { verifyRefreshToken, generateAccessToken } from '../../../lib/jwt';

/**
 * Models
 */
import Token from '../../../models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';
import type { Types } from 'mongoose';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try{
        const refreshToken = req.cookies.refreshToken as string;

        const tokenExists = await Token.exists({ token: refreshToken });

        if( !tokenExists ){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token!'
            });
            return;
        }

        //verify refresh token
        const jwtPayload = verifyRefreshToken( refreshToken ) as { userId: Types.ObjectId };

        //generate new access token
        const accessToken = generateAccessToken( jwtPayload.userId );

        //send new access token
        res.status(200).json({ accessToken });

        logger.info(`Access token refreshed for user ${ jwtPayload.userId }`);

    }catch(error){

        if( error instanceof TokenExpiredError ){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Refresh token expired!, please login again.'
            });

            logger.error('Refresh token expired!', error);
            
            return;
        }

        if( error instanceof JsonWebTokenError ){
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid refresh token!'
            });

            logger.error('Invalid refresh token!', error);

            return;
        }

        res.status(500).json({
            code: 'ServerError',
            message: 'Server Internal Error',
            error: error
        });

        logger.error('Error during refreshing token!', error);
    }
}

export default refreshToken;