import { Router } from 'express';
import UserController from '../controllers/UserController';
import User from '../models/User';

const router = Router();
const userController = new UserController(User);

router.get('/', (req, res) => userController.getAll(req, res));

export default { router, name: '/user' };
