import Log from '../models/Log';

async function create(content) {
    await Log.create({ content });
}

async function get(req, res) {
    try {
        const logs = await Log.findAll();
        return res.status(200).json(logs);
    } catch ({ message }) {
        return res.status(500).json({ message: `Erro ao buscar logs: ${message}` });
    }
}

export default { create, get };
