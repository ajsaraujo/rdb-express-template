import { expect } from 'chai';
import UserController from '../../../src/controllers/UserController';

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

        const mocks = TestUtils.mockReqRes(sandbox);
        req = mocks.req;
        res = mocks.res;
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

        it('should return 200 and create user', async () => {
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
            User.create.rejects({ message: 'Database file is locked' });

            await userController.create(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Erro ao criar usuário: Database file is locked' })).to.be.true;
        });
    });

    describe('update()', () => {
        beforeEach(() => {
            User.update = sandbox.stub();
            req.userId = '123456789000';

            req.body = {
                name: 'Sófocles Teamildo Espírito Januário Cruz',
                password: 'asenhasecreta',
                email: 'softeam@softeam.com.br'
            };
        });

        it('should return 404 if user was not found', async () => {
            User.update.resolves(null);

            await userController.update(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: `Não foi encontrado usuário com o id ${req.userId}` }));
        });

        it('should return 200 and update user data', async () => {
            User.update.resolves({});

            await userController.update(req, res);

            const call = User.update.getCall(0);
            expect(call.args[0]).to.deep.equal(req.body);
            expect(call.args[1]).to.deep.equal({ where: { id: req.userId } });
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Usuário atualizado com sucesso.' })).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            User.update.rejects({ message: 'Database file is locked' });

            await userController.update(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Erro ao atualizar usuário: Database file is locked' })).to.be.true;
        });
    });

    describe('getAll()', () => {
        beforeEach(() => {
            User.findAll = sandbox.stub();
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

            User.findAll.resolves(users);

            await userController.getAll(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(users)).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            User.findAll.rejects({ message: 'A busca falhou' });

            await userController.getAll(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'A busca falhou' })).to.be.true;
        });
    });

    describe('getById()', async () => {
        beforeEach(() => {
            User.findByPk = sandbox.stub();
            req.params.id = '123456789000';
        });

        it('should return 404 if user is not found', async () => {
            User.findByPk.resolves(null);

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

            User.findByPk.resolves(user);

            await userController.getById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(user)).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            User.findByPk.rejects({ message: 'Unable to connect to the database' });

            await userController.getById(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Erro ao buscar usuário: Unable to connect to the database' })).to.be.true;
        });
    });

    describe('remove()', () => {
        beforeEach(() => {
            req.userId = '123456789000';
            User.destroy = sandbox.stub();
        });

        it('should return 404 if user was not found', async () => {
            User.destroy.resolves(null);

            await userController.remove(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: `Não há nenhum usuário com o id ${req.userId}.` })).to.be.true;
        });

        it('should return 200 and delete the user with the given id', async () => {
            const user = {
                name: 'Mor Tod Asilva',
                email: 'mortodasilva@softeam.com.br',
                password: 'senhaencriptada'
            };

            User.destroy.resolves({});

            await userController.remove(req, res);

            expect(User.destroy.calledWith({ where: { id: req.userId } })).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: 'Usuário deletado com sucesso.' })).to.be.true;
        });

        it('should return 500 if an error is thrown', async () => {
            User.destroy.rejects({ message: 'Não deu pra deletar =/' });

            await userController.remove(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: 'Erro ao deletar usuário: Não deu pra deletar =/' })).to.be.true;
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
