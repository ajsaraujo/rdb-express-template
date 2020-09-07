import { Router } from 'express';
import emailInUse from '../middlewares/emailInUse';
import limitRequests from '../middlewares/limitRequests';
import validate from '../middlewares/validate';
import SessionController from '../controllers/SessionController';
import { User, authRules } from '../models/User';

const router = Router();

const sessionController = new SessionController(User);
router.post('/', limitRequests.heavily, validate(authRules), emailInUse, sessionController.auth);

export default { router, name: '/auth' };
