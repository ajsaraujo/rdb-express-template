import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import database from './database';
import router from './router';
import logErrors from './middlewares/logErrors';

function injectMiddlewares(app) {
    const middlewares = [
        helmet, cors, compression, express.json,
        [express.urlencoded, { extended: true }],
        logErrors
    ];

    middlewares.forEach(middleware => {
        if (typeof middleware === 'function') {
            app.use(middleware());
        } else {
            const [createMiddleware, args] = middleware;
            app.use(createMiddleware(args));
        }
    });
}

async function createApp() {
    const app = express();

    injectMiddlewares(app);

    app.use('/api', router);

    app.database = database;

    return app;
}

export default createApp;
