class UserController {
    constructor(User) {
        this.User = User;
    }

    async create(req, res) {
        if (req.emailInUse) {
            return res.status(400).json({ message: `O email ${req.body.email} já está em uso.` });
        }

        try {
            const user = await this.User.create(req.body);

            user.password = undefined;

            return res.status(201).json(user);
        } catch ({ message }) {
            return res.status(500).json({ message });
        }
    }

    async getAll(req, res) {
        try {
            const users = await this.User.findAll();
            return res.status(200).json(users);
        } catch ({ message }) {
            return res.status(500).json({ message });
        }
    }

    async getById(req, res) {
        try {
            const user = await this.User.findByPk(req.params.id);

            if (user === null) {
                return res.status(404).json({ message: `Não há usuário com o id ${req.params.id}.` });
            }

            return res.status(200).json(user);
        } catch ({ message }) {
            return res.status(500).json({ message: `Erro ao buscar usuário: ${message}` });
        }
    }
}

export default UserController;
