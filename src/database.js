import { Sequelize } from 'sequelize';
import path from 'path';
import DirectoryUtils from './utils/DirectoryUtils';

class Database {
    async initModels() {
        const modelsDirectory = path.join(__dirname, 'models');
        const models = await DirectoryUtils.getFilesInDirectory(modelsDirectory, '.js');

        models.forEach(Model => {
            Model.init(this.sequelize);
        });

        if (process.env.NODE_ENV === 'development') {
            await this.sequelize.sync({ alter: true });
        }
    }

    async connect() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, '..', 'db.sqlite'),
            logging: false
        });

        try {
            await this.sequelize.authenticate();
            console.log('Conexão com o banco de dados estabelecida com sucesso.');

            await this.initModels();
        } catch ({ message }) {
            console.error(`Erro ao conectar com o banco de dados: ${message}`);
        }
    }
}

export default Database;
