import LogController from '../../../src/controllers/LogController';

describe('LogController', () => {
    let Log;
    let logController;
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
        Log = { create: sandbox.stub() };
        logController = new LogController(Log);
    });

    describe('create()', () => {
        it('should create a Log with the given content', async () => {
            await logController.create('O servidor papocou');

            expect(Log.create.calledWith({ content: 'O servidor papocou' })).to.be.true;
        });
    });

    afterEach(() => sandbox.restore());
});