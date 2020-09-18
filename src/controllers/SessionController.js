import jwt from 'jsonwebtoken';
import PasswordUtils from '../utils/PasswordUtils';

async function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
}

class SessionController {
    constructor(User) {
        this.User = User;
    }

    async auth(req, res) {
        const { email, password } = req.body;

        const user = await this.User.findOne({ where: { email } });
        const passwordsMatch = await PasswordUtils.match(password, user?.password);

        if (user === null || !passwordsMatch) {
            return res.status(400).json({ message: 'Email e/ou senha incorretos.' });
        }

        user.password = undefined;
        const token = await generateToken(user.id);

        return res.status(200).json({ user, token });
    }
}

export default SessionController;
