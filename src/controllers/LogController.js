class LogController {
    constructor(Log) {
        this.Log = Log;
    }

    async create(content) {
        try {
            await this.Log.create({ content });
        } catch ({ message }) {
            console.log(message);
        }
    }

    async get(req, res) {
        try {
            const logs = await this.Log.find();
            return res.status(200).json(logs);
        } catch ({ message }) {
            return res.status(500).json({ message });
        }
    }
}

export default LogController;
