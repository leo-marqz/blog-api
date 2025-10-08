
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Router } from 'express';

const router = Router();

/**
 * Routes
 */
import authRouter from '../v1/auth';

/**
 * Root Route
 */
router.get('', (req, res)=>{
    res.json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        docs: 'https://docs.blog-api.leomarqz.com',
        timestamp: new Date().toISOString()
    })
});

router.use('/auth', authRouter);

export default router;

