
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Custom Modules
 */
import { logger } from '../../../lib/winston';
import config from '../../../config';


/**
 * Models
 */
import User from '../../../models/user';

/**
 * Types
 */
import type { Request, Response, NextFunction } from 'express';
import type { IUser } from '../../../models/user';

// Creates a new type with only 'email', 'password', and 'role' from the IUser interface
type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {

    const { email, password, role } = req.body as UserData;

    console.table({ email, password, role });

    try{
        res.status(201).json({
            message: 'New user created!'
        });
    }catch(error){
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal Server Error',
            error: error
        });
        logger.error('Error during user registration!', error);
    }
}

export default register;