import LogController from '../../../src/controllers/LogController';

describe('LogController', () => {
    let Log;
    let logController;
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
        Log = { create: sandbox.stub(), find: sandbox.stub() };
        logController = new LogController(Log);
    });

    describe('create()', () => {
        it('should create a Log with the given content', async () => {
            await logController.create('O servidor papocou');

            expect(Log.create.calledWith({ content: 'O servidor papocou' })).to.be.true;
        });
    });

    describe('get()', () => {
        let req;
        let res;

        beforeEach(() => {
            const mocks = TestUtils.mockReqRes(sandbox);
            req = mocks.req;
            res = mocks.res;
        });

        it('should return 200 and find all logs', async () => {
            const logs = [{ content: 'O servidor papocou' }, { content: 'Eh resenha soh kkk' }];

            Log.find.resolves(logs);

            await logController.get(req, res);

            expect(Log.find.getCall(0).args.length).to.equal(0);
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(logs)).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            Log.find.rejects({ message: 'Rapaz tá tudo pegando fogo' });

            await logController.get(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Rapaz tá tudo pegando fogo' })).to.be.true;
        });
    });

    afterEach(() => sandbox.restore());
});
