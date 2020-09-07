import rewire from 'rewire';

function mockReqRes(sandbox) {
    const req = { params: {} };

    const res = {
        status: sandbox.stub().callsFake(() => res),
        json: sandbox.stub().callsFake(returnItself)
    };

    const next = sandbox.stub();

    return { req, res, next };
}

function getPrivateMethod(modulePath, methodName) {
    const module = rewire(modulePath);

    /* eslint-disable */
    return module.__get__(methodName);
    /* eslint-enable */
}

export default { mockReqRes, getPrivateMethod };
