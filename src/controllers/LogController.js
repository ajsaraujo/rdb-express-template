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
}

export default LogController;