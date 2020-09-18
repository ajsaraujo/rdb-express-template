import { Router } from 'express';
import Log from '../models/Log';
import LogController from '../controllers/LogController';

const router = Router();
const logController = new LogController(Log);

router.get('/', (req, res) => logController.get(req, res));

export default { router, name: '/log' };
