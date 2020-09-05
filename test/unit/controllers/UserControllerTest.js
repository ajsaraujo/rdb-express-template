import sinon from 'sinon';
import UserController from '../../../src/controllers/UserController';
import { expect } from 'chai';

const { createSandbox } = sinon;

describe('UserController', () => {
    let sandbox;
    let req;
    let res;
    let statusStub;
    let jsonSpy;
    let User;
    let userController;

    beforeEach(() => {
        sandbox = createSandbox();

        User = { create: () => {} };
        userController = new UserController(User);

        res = { status: () => {}, json: returnItself };

        statusStub = sandbox.stub(res, 'status').returns(res);
        jsonSpy = sandbox.spy(res, 'json');
    });

    describe('create', () => {
        beforeEach(() => {
            req = {
                body: {
                    name: 'Sófocles Teamildo',
                    email: 'softeam@softeam.com.br',
                    password: 'cabecadegelo'
                },

                emailInUse: false
            };
        });

        it('should return 400 if email is already in use', async () => {
            req.emailInUse = true;

            await userController.create(req, res);

            sinon.assert.calledWith(statusStub, 400);
            sinon.assert.calledWith(jsonSpy, { message: 'O email softeam@softeam.com.br já está em uso.' });
        });

        it('should create an user and return it', async () => {
            const createStub = sandbox.stub(User, 'create').callsFake(returnItself);

            await userController.create(req, res);

            sinon.assert.calledWith(createStub, req.body);
            sinon.assert.calledWith(statusStub, 201);
            sinon.assert.calledWith(jsonSpy, req.body);
        });

        it('should not return the user password', async () => {
            sandbox.stub(User, 'create').callsFake(returnItself);

            const jsonData = await userController.create(req, res);

            expect(jsonData.password).to.be.undefined;
        });

        it('should return 500 if an error is thrown', async () => {
            sandbox.stub(User, 'create').rejects({ message: 'Erro ao criar usuário' });

            await userController.create(req, res);

            sinon.assert.calledWith(statusStub, 500);
            sinon.assert.calledWith(jsonSpy, { message: 'Erro ao criar usuário' });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
