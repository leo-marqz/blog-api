
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
        

    }catch(error){
        res.status(500).json({
            code: 'ServerError',
            message: 'Server Internal Error',
            error: error
        });
        logger.error('Error during refreshing token!', error);
    }
}

export default refreshToken;