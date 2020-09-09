import Log from '../models/Log';

class LogController {
    static async create(content) {
        try {
            await Log.create({ content });
        } catch ({ message }) {
            console.log(message);
        }
    }

    static async get(req, res) {
        try {
            const logs = await Log.find();
            return res.status(200).json(logs);
        } catch ({ message }) {
            return res.status(500).json({ message });
        }
    }
}

export default LogController;
