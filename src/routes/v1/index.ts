
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

// Node Modules
import { Router } from 'express';

const router = Router();

//Router
router.get('', (req, res)=>{
    res.json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        docs: 'https://docs.blog-api.leomarqz.com',
        timestamp: new Date().toISOString()
    })
})

export default router;

