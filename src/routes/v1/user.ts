
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Router } from "express";
import { param, query, body } from 'express-validator';

/**
 * Middlewares
 */
import authenticate from '../../middlewares/authenticate';
import validatonError from "../../middlewares/validationError";

/**
 * Controllers
 */

/**
 * Models
 */
import User from "../../models/user";

/**
 * Router
 */
const router = Router();


export default router;