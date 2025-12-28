
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import { generateAccessToken, generateRefreshToken } from '../../../lib/jwt';
import { logger } from '../../../lib/winston';
import config from '../../../config';

/**
 * Models
 */
import User from '../../../models/user';
import Token from '../../../models/token';


/**
 * Types
 */
import type { Request, Response } from 'express';
import type { IUser } from '../../../models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email, password } = req.body as UserData;
        const user = await User.findOne({ email })
                               .select('username email password role')
                               .lean()
                               .exec();
        
        if( !user ){
            res.status(404).json({
                code: 'NotFound',
                message: 'User not found.'
            });
            return;
        }

        const accessToken: string = generateAccessToken(user!._id);
        const refreshToken: string = generateRefreshToken(user!._id);

        await Token.create( { token: refreshToken, userId: user!._id } );
        logger.info(
            'Refresh token saved successfully for user', 
            { userId: user!._id, token: refreshToken }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        res.status(201).json({ accessToken, user:{
            username: user!.username,
            email: user!.email,
            role: user!.role
        } });

        logger.info(`User with email ${email} logged in successfully.`);

    }catch(error){
        res.status(500).json({
            code: 'ServerError',
            message: 'Server Internal Error',
            error: error
        });
        logger.error('Error during user login', error);
    }
}

export default login;