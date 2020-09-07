import { Types } from 'mongoose';
import verifyId from '../../../src/middlewares/verifyId';

describe('verifyId', () => {
    let req;
    let res;
    let next;
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();

        const mocks = TestUtils.mockReqRes(sandbox);

        req = mocks.req;
        res = mocks.res;
        next = mocks.next;
    });

    it('should return 400 if no id is given', async () => {
        await verifyId(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Nenhum id fornecido.' })).to.be.true;
    });

    it('should return 400 if object id is not valid', async () => {
        sandbox.stub(Types.ObjectId, 'isValid').returns(false);

        req.params.id = '123456789000';

        await verifyId(req, res, next);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: '123456789000 não é um id válido.' }));
    });

    it('should return next if everything is ok', async () => {
        sandbox.stub(Types.ObjectId, 'isValid').returns(true);

        req.params.id = '123456789000';

        await verifyId(req, res, next);

        expect(next.calledOnce).to.be.true;
    });

    afterEach(() => {
        sandbox.restore();
    });
});
