import verifyId from '../../../src/middlewares/verifyId';

describe('verifyId', () => {
    let req;
    let res;
    let next;
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();

        const mocks = TestUtils.mockReqRes(sandbox);

        req = mocks.req;
        res = mocks.res;
        next = mocks.next;
    });

    it('should return 400 if no id is given', async () => {
        await verifyId(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Você deve fornecer um id nos parâmetros da requisição.' })).to.be.true;
    });

    it('should return next if everything is ok', async () => {
        req.params.id = '123456789000';

        await verifyId(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    afterEach(() => {
        sandbox.restore();
    });
});
