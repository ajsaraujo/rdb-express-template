import { Router } from 'express';
import User from '../models/User';
import UserController from '../controllers/UserController';
import emailInUse from '../middlewares/emailInUse';
import validate from '../middlewares/validate';
import limitRequests from '../middlewares/limitRequests';

const router = Router();

router.post('/',
    limitRequests.heavily,
    validate(User.rules),
    emailInUse,
    UserController.create
);

export default { router, name: '/register' };
