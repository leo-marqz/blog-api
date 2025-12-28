
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
import token from '../../../models/token';

/**
 * Types
 */
import type { Request, Response } from 'express';

const logout = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.userId;
        res.sendStatus(204);
    }catch(error){
        logger.error('Error during logout', error );
    }
}

export default logout;