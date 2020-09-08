import verifyToken from '../../../src/middlewares/verifyToken';

describe('verifyToken', () => {
    let sandbox;

    const isMalformed = TestUtils.getPrivateMethod(
        '../../src/middlewares/verifyToken.js',
        'isMalformed'
    );

    beforeEach(() => {
        sandbox = createSandbox();
    });

    describe('isMalformed', () => {
        it('should return true if type is falsy', () => {
            expect(isMalformed(null, '1234ACdSa5dfaeas6')).to.be.true;
        });

        it('should return true if token is falsy', () => {
            expect(isMalformed('Bearer', '')).to.be.true;
        });

        it('should return true if type is not Bearer', () => {
            expect(isMalformed('Beare', '123sdwDWfe234esso243')).to.be.true;
        });

        it('should return false if everything is fine', () => {
            expect(isMalformed('Bearer', '1ewWOj20wdiskdçjawaei')).to.be.false;
        });
    });

    describe('verifyToken', () => {
        let req;
        let res;
        let next;
        let isMalformedStub;

        beforeEach(() => {
            const mocks = TestUtils.mockReqRes(sandbox);
            req = mocks.req;
            res = mocks.res;
            next = mocks.next;

            isMalformedStub = TestUtils.stubPrivateMethod(
                sandbox,
                '../../src/middlewares/verifyToken.js',
                'isMalformed'
            );
        });

        it('should return 401 if no token is provided', async () => {
            await verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Autenticação necessária.' }));
        });

        it('should return 401 if token is malformed', async () => {
            req.headers.authorization = 'Beare 123rrSasdkl3r5';

            isMalformedStub.returns(true);

            await verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Token inválido.' })).to.be.true;
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
