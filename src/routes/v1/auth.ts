
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */

import { Router } from "express";
import { body } from "express-validator";
import bcrypt from 'bcrypt';

/**
 * Controllers
 */
import register from "../../controllers/v1/auth/register";
import login from "../../controllers/v1/auth/login";
import refreshToken from "../../controllers/v1/auth/refreshToken";

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

// /api/v1/auth/register
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

// /api/v1/auth/login
router.post(
    '/login', 
    body('email') 
        .trim().notEmpty().withMessage('Email is required')
        .isLength({ max: 50 }).withMessage('Email must be less than 50 characters')
        .isEmail().withMessage('Invalid email address')
        .custom(async (value)=>{
            const userExists = await User.exists({email: value});
            if(!userExists){
                throw new Error('Email or password is invalid!');
            }
        }),
    body('password')
        .trim().notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .custom(async (value, { req })=>{
            // Here you can add additional password validations if needed
            const { email } = req.body as { email: string };
            const user = await User.findOne({ email }).select('password').lean().exec();

            if( !user ){
                throw new Error('Email or password is invalid!');
            }
            
            const isMatch = await bcrypt.compare(value, user.password);

            if( !isMatch ){
                throw new Error('Email or password is invalid!');
            }
        }),
    validationError, //middleware
    login //controller
);

// api/v1/auth/refresh-token
router.post('/refresh-token', refreshToken);

export default router;
