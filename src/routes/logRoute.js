import { Router } from 'express';
import LogController from '../controllers/LogController';
import Log from '../models/Log';

const router = Router();

const logController = new LogController(Log);
router.get('/', logController.get);

export default { router, name: '/log' };
