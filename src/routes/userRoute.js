import { Router } from 'express';
import UserController from '../controllers/UserController';
import User from '../models/User';
import verifyToken from '../middlewares/verifyToken';
import validate from '../middlewares/validate';
import limitRequests from '../middlewares/limitRequests';
import verifyId from '../middlewares/verifyId';

const router = Router();
const userController = new UserController(User);

router.use(limitRequests.slightly);

router.get('/', (req, res) => userController.getAll(req, res));
router.get('/:id', verifyId, (req, res) => userController.getById(req, res));

router.use(verifyToken);

router.put('/', validate(User.updateRules), (req, res) => userController.update(req, res));
router.delete('/', (req, res) => userController.remove(req, res));

export default { router, name: '/user' };
