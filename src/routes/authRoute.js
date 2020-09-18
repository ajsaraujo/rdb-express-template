import { Router } from 'express';
import User from '../models/User';
import SessionController from '../controllers/SessionController';
import validate from '../middlewares/validate';

const router = Router();
const sessionController = new SessionController(User);

router.post('/', validate(User.authRules), (req, res) => sessionController.auth(req, res));

export default { router, name: '/auth' };
