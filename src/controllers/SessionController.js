import { User } from '../models/User';
import PasswordUtils from '../utils/PasswordUtils';

async function auth(req, res) {
    const { email } = req.body;
    const plainTextPassword = req.body.password;

    const user = await User.findOne({ email });
    const passwordsMatch = await PasswordUtils.match(plainTextPassword, user?.password);

    if (!user || !passwordsMatch) {
        return res.status(400).json({ message: 'Email ou senha incorretos.' });
    }

    return res.status(200).json(user);
}

export default { auth };
