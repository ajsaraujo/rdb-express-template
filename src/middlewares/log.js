import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

function whenEverythingIsFine(req, res) {
    return res.statusCode < 400;
}

function createStream() {
    const filePath = path.join(__dirname, '../../acess.log');
    const streamOptions = { flags: 'a' };
    const stream = fs.createWriteStream(filePath, streamOptions);

    return stream;
}

function log() {
    let mode;
    const options = { skip: whenEverythingIsFine };

    if (process.env.NODE_ENV === 'production') {
        mode = 'common';
        options.stream = createStream();
    } else {
        mode = 'dev';
    }

    return morgan(mode, options);
}

export default log;
