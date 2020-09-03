import { Router } from 'express';

import UserController from './controllers/UserController';
import LogController from './controllers/LogController';
import SessionController from './controllers/SessionController';
import { userRules, authRules } from './models/User';
import validate from './middlewares/validate';
import checkId from './middlewares/checkId';
import emailInUse from './middlewares/emailInUse';

const router = Router();

router.get('/', (req, res) => res.status(200).json({ message: 'Seja bem vindo!' }));

router.put('/user/:id', validate(userRules), UserController.update);
router.get('/user', UserController.getAll);
router.get('/user/:id', checkId, UserController.getById);
router.delete('/user/:id', checkId, UserController.remove);

router.post('/register', validate(userRules), emailInUse, UserController.create);
router.post('/auth', validate(authRules), SessionController.auth);

router.get('/log', LogController.get);

export default router;
