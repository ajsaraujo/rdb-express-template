import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import compression from 'compression';
import helmet from 'helmet';

import database from './database';
import router from './router';
import logErrors from './middlewares/logErrors';

async function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(logErrors());

    app.use('/api', router);

    return app;
}

async function run() {
    config();

    await database.connect();

    const app = await createApp();

    app.listen(process.env.APP_PORT, () => {
        console.log(`A aplicação está escutando na porta ${process.env.APP_PORT}`);
    });
}

export default { run };
