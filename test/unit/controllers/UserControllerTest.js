import sinon from 'sinon';
import UserController from '../../../src/controllers/UserController';

const { createSandbox } = sinon;

describe('UserController', () => {
    let sandbox;
    let req;
    let res;
    let statusStub;
    let jsonSpy;

    beforeEach(() => {
        sandbox = createSandbox();

        req = {
            body: {
                name: 'Sófocles Teamildo',
                email: 'softeam@softeam.com.br',
                password: 'cabecadegelo'
            },
            emailInUse: false
        };

        res = { status: () => {}, json: () => {} };

        statusStub = sandbox.stub(res, 'status').returns(res);
        jsonSpy = sandbox.spy(res, 'json');
    });

    describe('create', () => {
        it('should return 400 if email is already in use', async () => {
            req.emailInUse = true;
            req.body.email = 'carlinhosjatemconta@gmail.com';

            const userController = new UserController();
            await userController.create(req, res);

            sinon.assert.calledWith(statusStub, 400);
            sinon.assert.calledWith(jsonSpy, { message: 'O email carlinhosjatemconta@gmail.com já está em uso.' });
        });

        it('should create an user and return it', async () => {
            const User = { create: () => {} };
            const createStub = sandbox.stub(User, 'create').callsFake(arg => arg);

            const userController = new UserController(User);
            await userController.create(req, res);

            sinon.assert.calledWith(createStub, req.body);
            sinon.assert.calledWith(statusStub, 201);
            sinon.assert.calledWith(jsonSpy, req.body);
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
