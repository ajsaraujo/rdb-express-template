import { Router } from 'express';
import UserController from '../controllers/UserController';
import User from '../models/User';
import emailInUse from '../middlewares/emailInUse';

const router = Router();
const userController = new UserController(User);

router.post('/', emailInUse, (req, res) => userController.create(req, res));

export default { router, name: '/register' };
