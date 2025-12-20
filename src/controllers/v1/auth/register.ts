
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
import { generateUsername } from '../../../utils';


/**
 * Models
 */
import User from '../../../models/user';
import Token from '../../../models/token';


/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';
import type { IUser } from '../../../models/user';

// Creates a new type with only 'email', 'password', and 'role' from the IUser interface
type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {

    const { email, password, role } = req.body as UserData;

    if( role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email) ){
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'You cannot register as an admin!.'
        });
        logger.warn(`User with email ${email} tried to register as an admin but is not in whitelist!`);
        return;
    }

    try{
        const username = await generateUsername();
        const newUser = await User.create({
            username,
            email,
            password,
            role
        });

        // Generate access token and refresh token for the new user
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // Save the refresh token in the database (optional).
        await Token.create( { token: refreshToken, userId: newUser._id } );
        logger.info('Refresh token saved successfully for user', {
            userId: newUser._id,
            token: refreshToken
        });

        // Set the refresh token in an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Adjust based on your requirements
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: 'New user created!',
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            accessToken: accessToken
        });

        logger.info('User registered successfully', {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        });

    }catch(error){
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: error
        });
        logger.error('Error during user registration!', error);
    }
}

export default register;