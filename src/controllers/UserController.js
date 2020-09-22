import User from '../models/User';

async function create(req, res) {
    if (req.emailInUse) {
        return res.status(400).json({ message: `O email ${req.body.email} já está em uso.` });
    }

    try {
        const user = await User.create(req.body);

        user.password = undefined;

        return res.status(201).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message: `Erro ao criar usuário: ${message}` });
    }
}

async function update(req, res) {
    try {
        const user = await User.update(req.body, { where: { id: req.userId } });

        if (user === null) {
            return res.status(404).json({ message: `Não foi encontrado usuário com o id ${req.userId}.` });
        }

        return res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
    } catch ({ message }) {
        return res.status(500).json({ message: `Erro ao atualizar usuário: ${message}` });
    }
}

async function remove(req, res) {
    try {
        const user = await User.destroy({ where: { id: req.userId } });

        if (user === null) {
            return res.status(404).json({ message: `Não há nenhum usuário com o id ${req.userId}.` });
        }

        return res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch ({ message }) {
        return res.status(500).json({ message: `Erro ao deletar usuário: ${message}` });
    }
}

async function getAll(req, res) {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch ({ message }) {
        return res.status(500).json({ message });
    }
}

async function getById(req, res) {
    try {
        const user = await User.findByPk(req.params.id);

        if (user === null) {
            return res.status(404).json({ message: `Não há usuário com o id ${req.params.id}.` });
        }

        return res.status(200).json(user);
    } catch ({ message }) {
        return res.status(500).json({ message: `Erro ao buscar usuário: ${message}` });
    }
}

export default {
    create, update, remove, getById, getAll
};
