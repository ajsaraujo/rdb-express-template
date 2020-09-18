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
}

export default UserController;
