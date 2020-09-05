import sinon from 'sinon';
import UserController from '../../../src/controllers/UserController';

const { createSandbox } = sinon;

describe('UserController', () => {
    let sandbox;
    let User;
    let userController;
    let req;
    let res;
    let statusStub;
    let jsonSpy;

    beforeEach(() => {
        sandbox = createSandbox();

        userController = new UserController(User);

        req = { body: {} };
        res = { status: () => {}, json: () => {} };

        statusStub = sandbox.stub(res, 'status').returns(res);
        jsonSpy = sandbox.spy(res, 'json');
    });

    describe('create', () => {
        it('should return 400 if email is already in use', async () => {
            req.emailInUse = true;
            req.body.email = 'carlinhosjatemconta@gmail.com';

            await userController.create(req, res);

            sinon.assert.calledWith(statusStub, 400);
            sinon.assert.calledWith(jsonSpy, { message: 'O email carlinhosjatemconta@gmail.com já está em uso.' });
        });
    });
});
