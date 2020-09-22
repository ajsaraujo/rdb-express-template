import { expect } from 'chai';
import UserController from '../../../src/controllers/UserController';
import User from '../../../src/models/User';

describe('UserController', () => {
    let sandbox;
    let req;
    let res;

    beforeEach(() => {
        sandbox = createSandbox();

        req = TestUtils.mockReq();
        res = TestUtils.mockRes();
    });

    describe('create()', () => {
        let createStub;

        beforeEach(() => {
            createStub = sandbox.stub(User, 'create');

            req.body = {
                name: 'Sófocles Teamildo',
                email: 'softeam@softeam.com.br',
                password: 'cabecadegelo'
            };

            req.emailInUse = false;
        });

        it('should return 400 if email is already in use', async () => {
            req.emailInUse = true;

            const { status, json } = await UserController.create(req, res);

            expect(status).to.equal(400);
            expect(json).to.deep.equal({ message: 'O email softeam@softeam.com.br já está em uso.' });
        });

        it('should return 200 and create user', async () => {
            createStub.resolves(req.body);

            const { status, json } = await UserController.create(req, res);

            expect(createStub.calledWith(req.body)).to.be.true;
            expect(status).to.equal(201);
            expect(json).to.deep.equal(req.body);
        });

        it('should not return the user password', async () => {
            createStub.callsFake(arg => arg);

            const { json } = await UserController.create(req, res);

            expect(json.password).to.be.undefined;
        });

        it('should return 500 if an error is thrown', async () => {
            createStub.rejects({ message: 'Falha ao conectar com bd' });

            const { status, json } = await UserController.create(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Erro ao criar usuário: Falha ao conectar com bd' });
        });
    });

    describe('update()', () => {
        let updateStub;

        beforeEach(() => {
            updateStub = sandbox.stub(User, 'update');

            req.userId = '123456789000';

            req.body = {
                name: 'Sófocles Teamildo Espírito Januário Cruz',
                password: 'asenhasecreta',
                email: 'softeam@softeam.com.br'
            };
        });

        it('should return 404 if user was not found', async () => {
            updateStub.resolves(null);

            const { status, json } = await UserController.update(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: `Não foi encontrado usuário com o id ${req.userId}.` });
        });

        it('should return 200 and update user data', async () => {
            updateStub.resolves({});

            const { status, json } = await UserController.update(req, res);

            const { args } = updateStub.getCall(0);

            expect(args).to.deep.equal([req.body, { where: { id: req.userId } }]);
            expect(json.password).to.be.undefined;
            expect(status).to.equal(200);
        });

        it('should return 500 if an error is thrown', async () => {
            updateStub.rejects({ message: 'ERR_CONNECTION_ERROR' });

            const { status, json } = await UserController.update(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Erro ao atualizar usuário: ERR_CONNECTION_ERROR' });
        });
    });

    describe('getAll()', () => {
        let findStub;

        beforeEach(() => {
            findStub = sandbox.stub(User, 'findAll');
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

            findStub.resolves(users);

            const { status, json } = await UserController.getAll(req, res);

            expect(status).to.equal(200);
            expect(json).to.deep.equal(users);
        });

        it('should return 500 if an error is thrown', async () => {
            findStub.rejects({ message: 'A busca falhou' });

            const { status, json } = await UserController.getAll(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'A busca falhou' });
        });
    });

    describe('getById()', async () => {
        let findStub;

        beforeEach(() => {
            findStub = sandbox.stub(User, 'findByPk');
            req.params.id = '123456789000';
        });

        it('should return 404 if user is not found', async () => {
            findStub.resolves(null);

            const { status, json } = await UserController.getById(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: `Não há usuário com o id ${req.params.id}.` });  });

        it('should return 200 and user', async () => {
            const user = {
                name: 'Zé da Onça',
                email: 'zedaonca@softeam.com.br',
                password: 'graaaaawrlllllnhaaauw'
            };

            findStub.resolves(user);

            const { status, json } = await UserController.getById(req, res);

            expect(status).to.equal(200);
            expect(json).to.deep.equal(user);
        });

        it('should return 500 if an error is thrown', async () => {
            findStub.rejects({ message: 'Usuário não encontrado' });

            const { status, json } = await UserController.getById(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Erro ao buscar usuário: Usuário não encontrado' });
        });
    });

    describe('remove()', () => {
        let removeStub;

        beforeEach(() => {
            req.userId = '123456789000';
            removeStub = sandbox.stub(User, 'destroy');
        });

        it('should return 404 if user was not found', async () => {
            removeStub.resolves(null);

            const { status, json } = await UserController.remove(req, res);

            expect(status).to.equal(404);
            expect(json).to.deep.equal({ message: `Não há usuário com o id ${req.userId}.` });
        });

        it('should return 200 if everything is fine', async () => {
            removeStub.resolves({});

            const { status, json } = await UserController.remove(req, res);

            expect(removeStub.calledWith({ where: { id: req.userId } })).to.be.true;
            expect(status).to.equal(200);
            expect(json).to.deep.equal({ message: 'Usuário deletado com sucesso.' });
        });

        it('should return 500 if an error is thrown', async () => {
            removeStub.rejects({ message: 'Não deu pra deletar =/' });

            const { status, json } = await UserController.remove(req, res);

            expect(status).to.equal(500);
            expect(json).to.deep.equal({ message: 'Erro ao deletar usuário: Não deu pra deletar =/' });
        });
    });

    afterEach(() => {
        sandbox.restore();
    });
});
