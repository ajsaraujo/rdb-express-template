import { Sequelize } from 'sequelize';
import path from 'path';

class Database {
    async connect() {
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, '..', 'db.sqlite'),
            logging: false
        });

        try {
            await this.sequelize.authenticate();
            console.log('Conexão com o banco de dados estabelecida com sucesso.');
        } catch (error) {
            console.error(`Erro ao conectar com o banco de dados: ${message}`);
        }
    }
}

export default Database;
