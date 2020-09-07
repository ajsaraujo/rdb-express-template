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

    afterEach(() => {
        sandbox.restore();
    });
});