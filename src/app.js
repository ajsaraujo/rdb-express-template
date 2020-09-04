import express from 'express';
import cors from 'cors';
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

    await database.connect();

    return app;
}

export default createApp;
