import mongoose from 'mongoose';

function connect() {
    const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    const options = { useNewUrlParser: true, useUnifiedTopology: true };

    console.log(`Tentando conectar ao banco de dados em ${uri}`);
    const connection = mongoose.connect(uri, options);

    mongoose.connection.once('open', () => {
        console.log('A aplicação conectou ao banco de dados com sucesso.');
    });

    mongoose.connection.on('error', () => {
        console.log('Erro ao conectar com o banco de dados.');
    });

    return connection;
}

export default { connect };
