import verifyToken from '../../../src/middlewares/verifyToken';

describe('verifyToken', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
    });

    describe('isMalformed', () => {
        const isMalformed = TestUtils.getPrivateMethod(
            '../../src/middlewares/verifyToken.js',
            'isMalformed'
        );

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

    afterEach(() => {
        sandbox.restore();
    });
});