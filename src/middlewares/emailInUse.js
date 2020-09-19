import User from '../models/User';

async function emailInUse(req, res, next) {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        req.emailInUse = user !== null;

        return next();
    } catch ({ message }) {
        return res.status(500).json({ message: `Erro ao buscar usuário por email: ${message}` });
    }
}

export default emailInUse;