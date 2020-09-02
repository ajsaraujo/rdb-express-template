import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

const REQUEST_DATA = '":req[header] :req-body (:req[content-length] bytes)"\n';
const RESPONSE_DATA = '":res[header] :res[content-length] bytes"\n';

const DEVELOPMENT_LOG_FORMAT = '":method :url :status :response-time[0] ms"\n'
    + REQUEST_DATA
    + RESPONSE_DATA
    + '\n\n';

const PRODUCTION_LOG_FORMAT = '":remote-addr - :remote-user [:date[web]]"\n'
    + '":method :url HTTP/:http-version :status :response-time[0] ms"\n'
    + REQUEST_DATA
    + RESPONSE_DATA
    + '":referrer" ":user-agent"\n\n';

function whenEverythingIsFine(req, res) {
    return res.statusCode < 400;
}

function createStream() {
    const filePath = path.join(__dirname, '../../acess.log');
    const streamOptions = { flags: 'a' };
    const stream = fs.createWriteStream(filePath, streamOptions);

    return stream;
}

function createMorganTokens() {
    morgan.token('req-body', (req, res) => JSON.stringify(req.body));
}

function log() {
    let format;
    const options = { skip: whenEverythingIsFine };

    createMorganTokens();

    if (process.env.NODE_ENV === 'production') {
        format = PRODUCTION_LOG_FORMAT;
        options.stream = createStream();
    } else {
        format = DEVELOPMENT_LOG_FORMAT;
    }

    return morgan(format, options);
}

export default log;
