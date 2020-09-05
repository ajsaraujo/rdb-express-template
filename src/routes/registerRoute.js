import { Router } from 'express';
import UserController from '../controllers/UserController';
import emailInUse from '../middlewares/emailInUse';
import validate from '../middlewares/validate';
import { User, userRules } from '../models/User';
import limitRequests from '../middlewares/limitRequests';

const router = Router();

const userController = new UserController(User);

router.post('/', limitRequests.heavily, validate(userRules), emailInUse, userController.create);

export default { router, name: '/register' };
