
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
import authorize from "../../middlewares/authorize";


/**
 * Controllers
 */
import getCurrentUser from "../../controllers/v1/user/getCurrentUser";
import updateCurrentUser from "../../controllers/v1/user/updateCurrentUser";

/**
 * Models
 */
import User from "../../models/user";

/**
 * Router
 */
const router = Router();

// /api/v1/user/current
router.get(
    '/current',
    authenticate,
    authorize(['admin', 'user']),
    getCurrentUser
);

router.put(
    'current',
    authenticate,
    authorize(['admin', 'user']),
    updateCurrentUser
)

export default router;