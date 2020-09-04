import { config } from 'dotenv';
import createApp from './app';

function addExitSignals(app, server, exitSignals) {
    exitSignals.forEach(signal => {
        process.on(signal, () => {
            server.close(err => {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }

                app.database.close(() => {
                    console.info('Conexão com o banco de dados foi fechada.');
                    process.exit(0);
                });
            });
        });
    });
}

(async () => {
    try {
        config();

        const app = await createApp();

        await app.database.connect();

        const server = app.listen(process.env.APP_PORT, () => {
            console.log(`O app está escutando na porta ${process.env.APP_PORT}!`);
        });

        addExitSignals(app, server, ['SIGINT', 'SIGTERM', 'SIGQUIT']);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
