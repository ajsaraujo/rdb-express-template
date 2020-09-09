import jwt from 'jsonwebtoken';
import PasswordUtils from '../utils/PasswordUtils';

class SessionController {
    constructor(User) {
        this.User = User;
    }

    /* eslint-disable */
    async generateToken(id) {
        return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
    }
    /* eslint-enable */

    async auth(req, res) {
        const { email } = req.body;
        const plainTextPassword = req.body.password;

        const user = await this.User.findOne({ email }).select('+password');
        const passwordsMatch = await PasswordUtils.match(plainTextPassword, user?.password);

        if (!user || !passwordsMatch) {
            return res.status(400).json({ message: 'Email ou senha incorretos.' });
        }

        user.password = undefined;
        const token = await this.generateToken(user.id);

        return res.status(200).json({ user, token });
    }
}

export default SessionController;
