import { Router } from 'express';

import UserController from './controllers/UserController';
import LogController from './controllers/LogController';
import SessionController from './controllers/SessionController';
import { userRules, authRules } from './models/User';
import verifyToken from './middlewares/verifyToken';
import validate from './middlewares/validate';
import emailInUse from './middlewares/emailInUse';
import limitRequests from './middlewares/limitRequests';

const router = Router();

router.get('/', (req, res) => res.status(200).json({ message: 'Seja bem vindo!' }));

router.put('/user', limitRequests.slightly, verifyToken, validate(userRules), UserController.update);
router.get('/user', limitRequests.slightly, UserController.getAll);
router.get('/user', limitRequests.slightly, UserController.getById);
router.delete('/user', limitRequests.slightly, verifyToken, UserController.remove);

router.get('/log', LogController.get);

router.use(limitRequests.heavily);
router.post('/register', validate(userRules), emailInUse, UserController.create);
router.post('/auth', validate(authRules), SessionController.auth);

export default router;
