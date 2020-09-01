import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import compression from 'compression';

import database from './database';
import router from './router';

async function run() {
    config();

    await database.connect();

    const app = express();

    app.use(cors());
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api', router);

    app.listen(process.env.APP_PORT);

    console.log(`A aplicação está escutando na porta ${process.env.APP_PORT}.`);
}

export default { run };
