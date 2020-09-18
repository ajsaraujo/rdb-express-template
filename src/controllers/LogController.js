class LogController {
    constructor(Log) {
        this.Log = Log;
    }

    async create(content) {
        try {
            await this.Log.create({ content });
        } catch ({ message }) {
            console.log(`Erro ao criar log: ${message}`);
        }
    }

    async getAll(req, res) {
        try {
            const logs = await this.Log.findAll();
            return res.status(200).json(logs);
        } catch ({ message }) {
            return res.status(500).json({ message: `Erro ao buscar logs: ${message}.` });
        }
    }
}

export default LogController;
