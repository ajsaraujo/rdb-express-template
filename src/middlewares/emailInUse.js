import User from '../models/User';

async function emailInUse(req, res, next) {
    try {
        const userArray = await User.findAll({
            where: {
                email: req.body.email
            }
        });

        req.emailInUse = userArray.length > 0;

        return next();
    } catch ({ message }) {
        return res.status(500).json({ message: `Erro ao buscar usuário por email: ${message}` });
    }
}

export default emailInUse;