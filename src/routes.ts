import {Request, Response} from 'express';
import { Router } from 'express';
import { getAvailableTimeFromQuery } from './service';
const router = Router();

router.get('/availability', getAvailableTimeFromQuery);
export default router;