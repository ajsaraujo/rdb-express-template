import { Router } from 'express';
import UserController from '../controllers/UserController';
import User from '../models/User';
import verifyToken from '../middlewares/verifyToken';
import validate from '../middlewares/validate';
import limitRequests from '../middlewares/limitRequests';
import verifyId from '../middlewares/verifyId';

const router = Router();

router.use(limitRequests.slightly);

router.get('/', UserController.getAll);
router.get('/:id', verifyId, UserController.getById);

router.use(verifyToken);

router.put('/', validate(User.updateRules), UserController.update);
router.delete('/', UserController.remove);

export default { router, name: '/user' };
