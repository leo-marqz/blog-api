
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
import authRoutes from '../v1/auth';
import userRoutes from '../v1/user';

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

router.use('/auth', authRoutes);
router.use('/users', userRoutes)

export default router;

