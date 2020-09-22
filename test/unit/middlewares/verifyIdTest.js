import verifyId from '../../../src/middlewares/verifyId';

describe('verifyId', () => {
    let sandbox;
    let req;
    let res;
    let next;

    beforeEach(() => {
        sandbox = createSandbox();

        req = TestUtils.mockReq();
        res = TestUtils.mockRes();
        next = TestUtils.mockNext(sandbox);
    });

    it('should return 400 if no id is given', async () => {
        const { json, status } = await verifyId(req, res, next);

        expect(status).to.equal(400);
        expect(json).to.deep.equal({ message: 'Você deve fornecer um id nos parâmetros da requisição.' });
    });

    it('should return next if an id was provided', async () => {
        req.params.id = '123456789000';

        await verifyId(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    afterEach(() => {
        sandbox.restore();
    });
});
