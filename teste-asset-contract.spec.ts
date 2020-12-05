/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { TesteAssetContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('TesteAssetContract', () => {

    let contract: TesteAssetContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new TesteAssetContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"teste asset 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"teste asset 1002 value"}'));
    });

    describe('#testeAssetExists', () => {

        it('should return true for a teste asset', async () => {
            await contract.testeAssetExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a teste asset that does not exist', async () => {
            await contract.testeAssetExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createTesteAsset', () => {

        it('should create a teste asset', async () => {
            await contract.createTesteAsset(ctx, '1003', 'Americanas', 'Loja Genérica', 5, 'Barra de chocolate', 25, '23/12/2020');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"teste asset 1003 value"}'));
        });

        it('should throw an error for a teste asset that already exists', async () => {
            await contract.createTesteAsset(ctx, '1001', 'Americanas', 'Loja Genérica', 5, 'Barra de chocolate', 25, '23/12/2020').should.be.rejectedWith(/The teste asset 1001 already exists/);
        });

    });

    describe('#readTesteAsset', () => {

        it('should return a teste asset', async () => {
            await contract.readTesteAsset(ctx, '1001').should.eventually.deep.equal({ value: 'teste asset 1001 value' });
        });

        it('should throw an error for a teste asset that does not exist', async () => {
            await contract.readTesteAsset(ctx, '1003').should.be.rejectedWith(/The teste asset 1003 does not exist/);
        });

    });

    describe('#updateDataTesteAsset', () => {

        it('should update a teste asset', async () => {
            await contract.updateDataTesteAsset(ctx, '1001', '25/12/2020');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"teste asset 1001 new value"}'));
        });

        it('should throw an error for a teste asset that does not exist', async () => {
            await contract.updateDataTesteAsset(ctx, '1003', '25/12/2020').should.be.rejectedWith(/The teste asset 1003 does not exist/);
        });

    });

    describe('#updatePagoTesteAsset', () => {

        it('should update a teste asset', async () => {
            await contract.updatePagoTesteAsset(ctx, '1001');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"teste asset 1001 new value"}'));
        });

        it('should throw an error for a teste asset that does not exist', async () => {
            await contract.updatePagoTesteAsset(ctx, '1003').should.be.rejectedWith(/The teste asset 1003 does not exist/);
        });

    });

    describe('#deleteTesteAsset', () => {

        it('should delete a teste asset', async () => {
            await contract.deleteTesteAsset(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a teste asset that does not exist', async () => {
            await contract.deleteTesteAsset(ctx, '1003').should.be.rejectedWith(/The teste asset 1003 does not exist/);
        });

    });

});