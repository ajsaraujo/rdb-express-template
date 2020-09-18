import jwt from 'jsonwebtoken';
import verifyToken from '../../../src/middlewares/verifyToken';

describe.skip('verifyToken', () => {
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

        beforeEach(() => {
            const mocks = TestUtils.mockReqRes(sandbox);
            req = mocks.req;
            res = mocks.res;
            next = mocks.next;
        });

        it('should return 401 if no token is provided', () => {
            verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Autenticação necessária.' }));
        });

        it('should return 401 if token is malformed', () => {
            req.headers.authorization = 'Beaer 123456789a32';

            verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Token inválido.' })).to.be.true;
        });

        it('should return next and inject user id into the request', () => {
            req.headers.authorization = 'Bearer 1234577920fsdaf';

            sandbox.stub(jwt, 'verify').returns({ id: 'bj435çsfkj' });

            verifyToken(req, res, next);

            expect(req.userId).to.equal('bj435çsfkj');
            expect(next.calledOnce).to.be.true;
        });

        it('should return 401 if an error is thrown', () => {
            req.headers.authorization = 'Bearer 143ijtdgr395';

            sandbox.stub(jwt, 'verify').throws(new Error('Token inválido'));

            verifyToken(req, res, next);

            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: 'Token inválido.' })).to.be.true;
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
