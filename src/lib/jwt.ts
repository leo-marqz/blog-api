
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import jwt from 'jsonwebtoken';


/** 
 * Custom Modules
 */
import config from '../config';

/**
 * Types
 */
import { Types } from 'mongoose';


export const generateAccessToken = (userId: Types.ObjectId): string => {
    return jwt.sign( { userId },  config.JWT_ACCESS_SECRET, { 
        expiresIn: config.ACCESS_TOKEN_EXPIRY,
        subject: 'accessApi'
    });
}









