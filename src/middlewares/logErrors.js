import morgan from 'morgan';
import { PassThrough } from 'stream';
import { carry } from 'carrier';
import { Log } from '../models/Log';

async function logToMongo(log) {
    console.log('Criando documento log...');

    try {
        await Log.create({ log });
    } catch ({ message }) {
        console.log(message);
    }
}

function createStream() {
    const stream = new PassThrough();
    
    const lineStream = carry(stream);
    lineStream.on('line', logToMongo);

    return stream;
}

function whenEverythingIsFine(req, res) {
    return res.statusCode < 400;
}

function logErrors() {
    let format;
    const options = { skip: whenEverythingIsFine };

    if (process.env.NODE_ENV === 'production') {
        format = ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
        options.stream = createStream();
    } else {
        format = 'dev';
        format = DEVELOPMENT_LOG_FORMAT;
    }

    return morgan(format, options);
}

export default logErrors;
