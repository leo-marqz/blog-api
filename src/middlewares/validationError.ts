
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { validationResult } from "express-validator";

/**
 * Types
 */
import type { Request, Response, NextFunction } from "express";

const validatonError = (req: Request, res: Response, next: NextFunction)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({
            code: 'ValidationError',
            errors: errors.mapped(),
        });
        return;
    }

    next(); //siguiente middleware

}

export default validatonError;

