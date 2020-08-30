import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import database from './database';

async function run() {
    config();

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    await database.connect();

    app.listen(process.env.APP_PORT);

    console.log(`A aplicação está escutando na porta ${process.env.APP_PORT}.`);
}

export default { run };
