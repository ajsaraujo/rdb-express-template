import sinon from 'sinon';
import UserController from '../../../src/controllers/UserController';

const { createSandbox } = sinon;

describe('UserController', () => {
    let sandbox;
    let req;
    let res;
    let User;
    let userController;

    beforeEach(() => {
        sandbox = createSandbox();

        User = {};
        userController = new UserController(User);

        res = {
            status: sandbox.stub(),
            json: sandbox.stub()
        };

        res.status.callsFake(() => res);
        res.json.callsFake(returnItself);
    });

    describe('create', () => {
        beforeEach(() => {
            User.create = sandbox.stub();

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

            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.json, { message: 'O email softeam@softeam.com.br já está em uso.' });
        });

        it('should create an user and return it', async () => {
            User.create.callsFake(returnItself);

            await userController.create(req, res);

            sinon.assert.calledWith(User.create, req.body);
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledWith(res.json, req.body);
        });

        it('should not return the user password', async () => {
            User.create.callsFake(returnItself);

            const jsonData = await userController.create(req, res);

            expect(jsonData.password).to.be.undefined;
        });

        it('should return 500 if an error is thrown', async () => {
            User.create.rejects({ message: 'Erro ao criar usuário' });

            await userController.create(req, res);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledWith(res.json, { message: 'Erro ao criar usuário' });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
