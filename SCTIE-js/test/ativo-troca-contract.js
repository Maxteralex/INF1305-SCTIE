/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { AtivoTrocaContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('AtivoTrocaContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new AtivoTrocaContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{vendedor:"Americanas", comprador:"Loja Genérica", quantidade:5, produto:"Barra de Chocolate", valor:25, dataVencimento:"23/12/2020"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{vendedor:"Casas Bahia", comprador:"Loja Genérica", quantidade:2, produto:"Televisão LCD 50 polegadas", valor:2500, dataVencimento:"28/12/2020"}'));
    });

    describe('#ativoTrocaExists', () => {

        it('retorna true para um ativo de troca existente', async () => {
            await contract.ativoTrocaExists(ctx, '1001').should.eventually.be.true;
        });

        it('returna false para um ativo de troca que não existe', async () => {
            await contract.ativoTrocaExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createAtivoTroca', () => {

        it('cria um ativo de troca', async () => {
            await contract.createAtivoTroca(ctx, '1003', 'ativo troca 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"ativo troca 1003 value"}'));
        });

        it('should throw an error for a ativo troca that already exists', async () => {
            await contract.createAtivoTroca(ctx, '1001', 'myvalue').should.be.rejectedWith(/The ativo troca 1001 already exists/);
        });

    });

    describe('#readAtivoTroca', () => {

        it('should return a ativo troca', async () => {
            await contract.readAtivoTroca(ctx, '1001').should.eventually.deep.equal({ value: 'ativo troca 1001 value' });
        });

        it('should throw an error for a ativo troca that does not exist', async () => {
            await contract.readAtivoTroca(ctx, '1003').should.be.rejectedWith(/The ativo troca 1003 does not exist/);
        });

    });

    describe('#updateAtivoTroca', () => {

        it('should update a ativo troca', async () => {
            await contract.updateAtivoTroca(ctx, '1001', 'ativo troca 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"ativo troca 1001 new value"}'));
        });

        it('should throw an error for a ativo troca that does not exist', async () => {
            await contract.updateAtivoTroca(ctx, '1003', 'ativo troca 1003 new value').should.be.rejectedWith(/The ativo troca 1003 does not exist/);
        });

    });

    describe('#deleteAtivoTroca', () => {

        it('should delete a ativo troca', async () => {
            await contract.deleteAtivoTroca(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a ativo troca that does not exist', async () => {
            await contract.deleteAtivoTroca(ctx, '1003').should.be.rejectedWith(/The ativo troca 1003 does not exist/);
        });

    });

});