import jwt from 'jsonwebtoken';
import User from '../../../src/models/User';
import PasswordUtils from '../../../src/utils/PasswordUtils';
import SessionController from '../../../src/controllers/SessionController';

describe('SessionController', () => {
    describe('auth', () => {
        let req;
        let res;
        let sandbox;
        let findStub;
        let matchStub;

        const mockUser = {
            email: 'juliao@softeam.com.br',
            name: 'Julião da Motoca',
            password: '2x45V6yxhsKslsa123çCad'
        };

        beforeEach(() => {
            sandbox = createSandbox();

            req = TestUtils.mockReq();
            res = TestUtils.mockRes();

            req.body = {
                email: 'meteoro@softeam.com.br',
                password: 'altoimpacto'
            };

            findStub = sandbox.stub(User, 'findOne');
            matchStub = sandbox.stub(PasswordUtils, 'match');
        });

        it('should find the user by email', async () => {
            findStub.resolves(null);

            await SessionController.auth(req, res);

            expect(User.findOne.calledWith({ where: { email: req.body.email } })).to.be.true;
        });

        it('should match the encrypted password against the provided password', async () => {
            findStub.resolves(mockUser);

            await SessionController.auth(req, res);

            expect(PasswordUtils.match.calledWith(req.body.password, mockUser.password));
        });

        it('should return 400 if user is not found', async () => {
            findStub.resolves(null);
            matchStub.resolves(true);

            const { status, json } = await SessionController.auth(req, res);

            expect(status).to.equal(400);
            expect(json).to.deep.equal({ message: 'Email e/ou senha incorretos.' });
        });

        it('should return 400 if passwords do not match', async () => {
            findStub.resolves(mockUser);
            matchStub.resolves(false);

            const { status, json } = await SessionController.auth(req, res);

            expect(status).to.equal(400);
            expect(json).to.deep.equal({ message: 'Email e/ou senha incorretos.' });
        });

        it('should return 200 with the user and token', async () => {
            findStub.resolves(mockUser);
            matchStub.resolves(true);

            sandbox.stub(jwt, 'sign').resolves('tokenemdoido');

            const userWithoutPassword = mockUser;
            delete userWithoutPassword.password;

            const { status, json } = await SessionController.auth(req, res);

            expect(status).to.equal(200);
            expect(json).to.deep.equal({ user: userWithoutPassword, token: 'tokenemdoido' });
        });

        afterEach(() => {
            sandbox.restore();
        });
    });
});
