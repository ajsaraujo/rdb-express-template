export default function mockReqRes(sandbox) {
    const req = { params: {} };
    const res = {
        status: sandbox.stub().callsFake(() => res),
        json: sandbox.stub().callsFake(returnItself)
    };

    return { req, res };
}
