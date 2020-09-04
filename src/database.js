import mongoose from 'mongoose';

function connect() {
    const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    };

    mongoose.connect(uri, options);
}

function close() {
    mongoose.connection.close();
}

export default { connect, close, connection: mongoose.connection };
