import PasswordUtils from '../../../src/utils/PasswordUtils';
import SessionController from '../../../src/controllers/SessionController';

describe('SessionController', () => {
    describe('auth', () => {
        let req;
        let res;
        let sandbox;
        let User;
        let sessionController;

        const mockUser = {
            email: 'juliao@softeam.com.br',
            name: 'Julião da Motoca',
            password: '2x45V6yxhsKslsa123çCad'
        };

        beforeEach(() => {
            sandbox = createSandbox();
            const mocks = TestUtils.mockReqRes(sandbox);

            req = mocks.req;
            res = mocks.res;

            req.body = {
                email: 'meteoro@softeam.com.br',
                password: 'altoimpacto'
            };

            User = { findOne: () => {} };
            sessionController = new SessionController(User);
        });

        it('should find the user by email', async () => {
            sandbox.stub(User, 'findOne').returns({ select: () => null });

            await sessionController.auth(req, res);

            expect(User.findOne.calledWith({ email: req.body.email })).to.be.true;
        });

        it('should match the encrypted password against the provided password', async () => {
            sandbox.stub(PasswordUtils, 'match');
            sandbox.stub(User, 'findOne').returns({ select: () => mockUser });

            await sessionController.auth(req, res);

            expect(PasswordUtils.match.calledWith(req.body.password, mockUser.password));
        });

        it('should return 400 if user is not found', async () => {
            sandbox.stub(User, 'findOne').returns({ select: () => null });
            sandbox.stub(PasswordUtils, 'match').resolves(true);

            await sessionController.auth(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Email ou senha incorretos.' })).to.be.true;
        });

        it('should return 400 if passwords do not match', async () => {
            sandbox.stub(User, 'findOne').returns({ select: () => mockUser });
            sandbox.stub(PasswordUtils, 'match').resolves(false);

            await sessionController.auth(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'Email ou senha incorretos.' })).to.be.true;
        });

        it('should return 200 with the user and token', async () => {
            sandbox.stub(User, 'findOne').returns({ select: () => mockUser });
            sandbox.stub(PasswordUtils, 'match').resolves(true);
            sandbox.stub(sessionController, 'generateToken').resolves('tokenemdoido');

            const userWithoutPassword = mockUser;
            delete userWithoutPassword.password;

            const json = await sessionController.auth(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(json).to.deep.equal({ user: userWithoutPassword, token: 'tokenemdoido' });
        });

        afterEach(() => {
            sandbox.restore();
        });
    });
});
