import { Router } from 'express';
import User from '../models/User';
import SessionController from '../controllers/SessionController';
import validate from '../middlewares/validate';
import limitRequests from '../middlewares/limitRequests';

const router = Router();

router.post('/',
    limitRequests.heavily,
    validate(User.authRules),
    SessionController.auth
);

export default { router, name: '/auth' };
