import app from '../../src/app';

describe('app', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
    });

    describe('injectMiddlewares', () => {
        let appMock;
        let middlewares;

        beforeEach(() => {
            appMock = { use: sandbox.stub() };

            middlewares = [
                sandbox.stub().returns('Finja que eu sou um middleware!'),
                sandbox.stub().returns('E eu sou outro :p')
            ];
        });

        const injectMiddlewares = TestUtils
            .getPrivateMethod(
                '../../src/app',
                'injectMiddlewares'
            );

        it('should inject middlewares in the app', () => {
            injectMiddlewares(appMock, middlewares);

            middlewares.forEach(middleware => {
                expect(middleware.calledOnce).to.be.true;
                expect(appMock.use.calledWith(middleware())).to.be.true;
            });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});