import { Router } from 'express';
import UserController from '../controllers/UserController';
import User from '../models/User';
import emailInUse from '../middlewares/emailInUse';
import validate from '../middlewares/validate';

const router = Router();
const userController = new UserController(User);

router.post('/', validate(User.validationRules), emailInUse, (req, res) => userController.create(req, res));

export default { router, name: '/register' };
