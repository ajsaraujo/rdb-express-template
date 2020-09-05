import sinon from 'sinon';
import UserController from '../../../src/controllers/UserController';
import { expect } from 'chai';

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

    describe('create()', () => {
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

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: 'O email softeam@softeam.com.br já está em uso.' })).to.be.true;
        });

        it('should create an user and return it', async () => {
            User.create.callsFake(returnItself);

            await userController.create(req, res);

            expect(User.create.calledWith(req.body)).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(req.body)).to.be.true;
        });

        it('should not return the user password', async () => {
            User.create.callsFake(returnItself);

            const jsonData = await userController.create(req, res);

            expect(jsonData.password).to.be.undefined;
        });

        it('should return 500 if an error is thrown', async () => {
            User.create.rejects({ message: 'Erro ao criar usuário' });

            await userController.create(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Erro ao criar usuário' })).to.be.true;
        });
    });

    describe('update()', () => {
        beforeEach(() => {
            User.findById = sandbox.stub();
            req.userId = '123456789000';
        });

        it('should find the user with the given id', async () => {
            User.findById.returns({ select: () => null });
            await userController.update(req, res);

            expect(User.findById.calledWith(req.userId)).to.be.true;
        });

        it('should return 404 if user was not found', async () => {
            User.findById.returns({ select: () => null });

            await userController.update(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: `Não foi encontrado usuário com o id ${req.userId}` }));
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
