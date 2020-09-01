import { Router } from 'express';

import UserController from './controllers/UserController';
import { userRules } from './models/User';
import validate from './middlewares/validate';
import checkId from './middlewares/checkId';

const router = Router();

router.get('/', (req, res) => res.status(200).json({ message: 'Seja bem vindo!' }));
router.post('/user', validate(userRules), UserController.create);
router.put('/user/:id', validate(userRules), UserController.update);
router.get('/user', UserController.getAll);
router.get('/user/:id', checkId, UserController.getById);
router.delete('/user/:id', checkId, UserController.remove);

export default router;
