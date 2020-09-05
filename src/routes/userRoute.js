import { Router } from 'express';
import UserController from '../controllers/UserController';
import { User, userRules } from '../models/User';
import limitRequests from '../middlewares/limitRequests';
import verifyToken from '../middlewares/verifyToken';
import verifyId from '../middlewares/verifyId';
import validate from '../middlewares/validate';

const router = Router();
const userController = new UserController(User);

router.use(limitRequests.slightly);

router.get('/', userController.getAll);
router.get('/:id', verifyId, userController.getById);

router.use(verifyToken);

router.put('/', validate(userRules), userController.update);
router.delete('/', userController.remove);

export default { router, name: '/user' };
