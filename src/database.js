import { Sequelize } from 'sequelize';
import path from 'path';
import DirectoryUtils from './utils/DirectoryUtils';
import LogUtils from './utils/LogUtils';

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

        await this.sequelize.authenticate();

        LogUtils.log('Conexão com o banco de dados estabelecida com sucesso.');

        await this.initModels();
    }
}

export default Database;
