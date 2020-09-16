import { Router } from 'express';
import UserController from '../controllers/UserController';
import User from '../models/User';

const router = Router();
const userController = new UserController(User);

router.post('/', (req, res) => userController.create(req, res));

export default { router, name: '/register' };
