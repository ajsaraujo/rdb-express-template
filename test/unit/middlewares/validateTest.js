import validate from '../../../src/middlewares/validate';
import { expect } from 'chai';

describe('validate', () => {
    let sandbox;
    let req;
    let res;
    let next;
    let schema;

    beforeEach(() => {
        sandbox = createSandbox();

        const mocks = TestUtils.mockReqRes(sandbox);

        req = mocks.req;
        res = mocks.res;
        next = mocks.next;

        req.body = {
            name: 'Ranger Vermelho',
            email: 'redranger@softeam.com.br',
            password: 'omoraldopaulorenger'
        };

        schema = { validateAsync: sandbox.stub() };
    });

    it('should validate the request body', async () => {
        await validate(schema)(req, res, next);

        expect(schema.validateAsync.calledWith(req.body)).to.be.true;
    });

    it('should call next if validation succeeds', async () => {
        schema.validateAsync.resolves();

        await validate(schema)(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    it('should return 400 if validation fails', async () => {
        schema.validateAsync.rejects({ message: 'Dados horríveis' });

        await validate(schema)(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Dados horríveis' })).to.be.true;
    });

    afterEach(() => {
        sandbox.restore();
    });
});
