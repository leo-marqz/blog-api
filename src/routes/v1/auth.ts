
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */

import { Router } from "express";
import { body } from "express-validator";

/**
 * Controllers
 */
import register from "../../controllers/v1/auth/register";

/**
 * Middlewares
 */
import validationError from '../../middlewares/validationError';

/**
 * Models
 */
import User from "../../models/user";

/**
 * Router
 */

const router = Router();

router.post(
    '/register', //path
    //validations middleware
    body('email') 
        .trim().notEmpty().withMessage('Email is required')
        .isLength({ max: 50 }).withMessage('Email must be less than 50 characters')
        .isEmail().withMessage('Invalid email address')
        .custom(async (value)=>{
            const userExists = await User.exists({email: value});
            if(userExists){
                throw new Error('Email or password is invalid!');
            }
        }),
    body('password')
        .trim().notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role')
        .optional().isString().withMessage('Role must be a string')
        .isIn(['user', 'admin']).withMessage('Role must be either admin or user!'),
    validationError, //middleware
    register //controller
);

export default router;
