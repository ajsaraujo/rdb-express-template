import { config } from 'dotenv';
import createApp from './app';

(async () => {
    config();

    const app = await createApp();

    app.listen(process.env.APP_PORT, () => {
        console.log(`O app está escutando na porta ${process.env.APP_PORT}!`);
    });
})();