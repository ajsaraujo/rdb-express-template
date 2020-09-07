import rewire from 'rewire';

function mockReqRes(sandbox) {
    const req = { params: {} };
    const res = {
        status: sandbox.stub().callsFake(() => res),
        json: sandbox.stub().callsFake(returnItself)
    };

    return { req, res };
}

function getPrivateMethod(modulePath, methodName) {
    const module = rewire(modulePath);

    /* eslint-disable */
    return module.__get__(methodName);
    /* eslint-enable */
}

export default { mockReqRes, getPrivateMethod };
