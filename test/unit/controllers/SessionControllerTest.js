import { createSandbox } from 'sinon';
import TestUtils from '../TestUtils';
import PasswordUtils from '../../../src/utils/PasswordUtils';
import SessionController from '../../../src/controllers/SessionController';

describe('SessionController', () => {
    describe('auth', () => {
        let req;
        let res;
        let sandbox;
        let User;
        let sessionController;

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

        afterEach(() => {
            sandbox.restore();
        });
    });
});