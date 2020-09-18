import { Router } from 'express';
import UserController from '../controllers/UserController';
import User from '../models/User';
import verifyToken from '../middlewares/verifyToken';
import validate from '../middlewares/validate';

const router = Router();
const userController = new UserController(User);

router.put('/', verifyToken, validate(User.updateRules), (req, res) => userController.update(req, res));
router.delete('/', verifyToken, (req, res) => userController.remove(req, res));
router.get('/', (req, res) => userController.getAll(req, res));
router.get('/:id', (req, res) => userController.getById(req, res));

export default { router, name: '/user' };
