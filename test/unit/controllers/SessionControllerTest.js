import { createSandbox } from 'sinon';
import TestUtils from '../TestUtils';
import PasswordUtils from '../../../src/utils/PasswordUtils';
import SessionController from '../../../src/controllers/SessionController';
import { expect } from 'chai';

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

        afterEach(() => {
            sandbox.restore();
        });
    });
});