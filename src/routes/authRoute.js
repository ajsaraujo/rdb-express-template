import { Router } from 'express';
import User from '../models/User';
import SessionController from '../controllers/SessionController';
import validate from '../middlewares/validate';
import limitRequests from '../middlewares/limitRequests';

const router = Router();
const sessionController = new SessionController(User);

router.post('/',
    limitRequests.heavily,
    validate(User.authRules),
    (req, res) => sessionController.auth(req, res)
);

export default { router, name: '/auth' };
