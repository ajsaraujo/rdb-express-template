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

        req = { params: {} };

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

            req.body = {
                name: 'Sófocles Teamildo',
                email: 'softeam@softeam.com.br',
                password: 'cabecadegelo'
            };

            req.emailInUse = false;
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

            req.body = {
                name: 'Sófocles Teamildo Espírito Januário Cruz',
                password: 'asenhasecreta',
                email: 'softeam@softeam.com.br'
            };
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

        it('should update user data and return 200', async () => {
            const user = { save: sandbox.spy() };
            User.findById.returns({ select: () => user });

            await userController.update(req, res);

            const { email, name } = req.body;

            expect(user.name).to.equal(name);
            expect(user.email).to.equal(email);
            expect(user.password).to.be.undefined;
            expect(user.save.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(user)).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            User.findById.returns({
                select: () => {
                    throw new Error('Erro ao buscar usuário');
                }
            });

            await userController.update(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Erro ao buscar usuário' })).to.be.true;
        });
    });

    describe('getAll()', () => {
        beforeEach(() => {
            User.find = sandbox.stub();
        });

        it('should return 200 and a list of users', async () => {
            const users = [{
                name: 'Jonas Lima',
                email: 'jonaslima@softeam.com.br',
                password: 'designehminhapaixao'
            }, {
                name: 'Yves Bastos',
                email: 'yvesbastos@softeam.com.br',
                password: 'acabecadopovo'
            }];

            User.find.resolves(users);

            await userController.getAll(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(users)).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            User.find.rejects({ message: 'A busca falhou' });

            await userController.getAll(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'A busca falhou' })).to.be.true;
        });
    });

    describe('getById()', async () => {
        beforeEach(() => {
            User.findById = sandbox.stub();
            req.params.id = '123456789000';
        });

        it('should return 404 if user is not found', async () => {
            User.findById.resolves(null);

            await userController.getById(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: `Não há usuário com o id ${req.params.id}.` }));
        });

        it('should return 200 and user', async () => {
            const user = {
                name: 'Zé da Onça',
                email: 'zedaonca@softeam.com.br',
                password: 'graaaaawrlllllnhaaauw'
            };

            User.findById.resolves(user);

            await userController.getById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(user)).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            User.findById.rejects({ message: 'Usuário não encontrado' });

            await userController.getById(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Usuário não encontrado' })).to.be.true;
        });
    });

    describe('remove()', () => {
        beforeEach(() => {
            req.userId = '123456789000';
            User.findByIdAndRemove = sandbox.stub();
        });

        it('should return 404 if user was not found', async () => {
            User.findByIdAndRemove.resolves(null);

            await userController.remove(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: 'Usuário não encontrado.' })).to.be.true;
        });

        it('should delete the user with the given id and return 200', async () => {
            const user = {
                name: 'Mor Tod Asilva',
                email: 'mortodasilva@softeam.com.br',
                password: 'senhaencriptada'
            };

            User.findByIdAndRemove.resolves(user);

            await userController.remove(req, res);

            expect(User.findByIdAndRemove.calledWith(req.userId)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(user)).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            User.findByIdAndRemove.rejects({ message: 'Não deu pra deletar =/' });

            await userController.remove(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Não deu pra deletar =/' })).to.be.true;
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
