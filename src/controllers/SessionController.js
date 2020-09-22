import jwt from 'jsonwebtoken';
import User from '../models/User';
import PasswordUtils from '../utils/PasswordUtils';

async function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '1d' });
}

async function auth(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    const passwordsMatch = await PasswordUtils.match(password, user?.password);

    if (user === null || !passwordsMatch) {
        return res.status(400).json({ message: 'Email e/ou senha incorretos.' });
    }

    const token = await generateToken(user.id);

    user.password = undefined;

    return res.status(200).json({ user, token });
}

export default { auth };
