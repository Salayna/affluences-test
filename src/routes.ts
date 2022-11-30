import {Request, Response} from 'express';
import { Router } from 'express';
import { getAvailableTimeFromQuery } from './service';
const router = Router();

router.get('/', (req:Request, res:Response) => {
    res.send('Hello World!');
});

router.get('/test', getAvailableTimeFromQuery);
export default router;