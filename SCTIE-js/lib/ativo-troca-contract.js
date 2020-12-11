/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AtivoTrocaContract extends Contract {

    async ativoTrocaExists(ctx, ativoTrocaId) {
        const buffer = await ctx.stub.getState(ativoTrocaId);
        return (!!buffer && buffer.length > 0);
    }

    async createAtivoTroca(ctx, ativoTrocaId, comprador, vendedor, quantidade, produto, valor, dataVencimento) {
        const exists = await this.ativoTrocaExists(ctx, ativoTrocaId);
        if (exists) {
            throw new Error(`O ativo de troca ${ativoTrocaId} já existe`);
        }
        const asset = {comprador: comprador, vendedor: vendedor, quantidade: quantidade, produto: produto, valor: valor, dataVencimento: dataVencimento, pago: false};
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ativoTrocaId, buffer);
        console.log(JSON.stringify(asset));
    }

    async readAtivoTroca(ctx, ativoTrocaId) {
        const exists = await this.ativoTrocaExists(ctx, ativoTrocaId);
        if (!exists) {
            throw new Error(`O ativo de troca ${ativoTrocaId} não existe`);
        }
        const buffer = await ctx.stub.getState(ativoTrocaId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateDataAtivoTroca(ctx, ativoTrocaId, data) {
        const exists = await this.ativoTrocaExists(ctx, ativoTrocaId);
        if (!exists) {
            throw new Error(`O ativo de troca ${ativoTrocaId} não existe`);
        }
        let buffer = await ctx.stub.getState(ativoTrocaId);
        const asset = JSON.parse(buffer.toString());
        asset.dataVencimento = data;
        buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ativoTrocaId, buffer);
    }

    async updatePagoAtivoTroca(ctx, ativoTrocaId){
        const exists = await this.ativoTrocaExists(ctx, ativoTrocaId);
        if (!exists) {
            throw new Error(`O ativo de troca ${ativoTrocaId} não existe`);
        }
        let buffer = await ctx.stub.getState(ativoTrocaId);
        const asset = JSON.parse(buffer.toString());
        asset.pago = !asset.pago;
        buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(ativoTrocaId, buffer);
    }

    async deleteAtivoTroca(ctx, ativoTrocaId) {
        const exists = await this.ativoTrocaExists(ctx, ativoTrocaId);
        if (!exists) {
            throw new Error(`O ativo de troca ${ativoTrocaId} não existe`);
        }
        await ctx.stub.deleteState(ativoTrocaId);
    }

    async getAllAtivoTroca(ctx) {
        const assetsArray = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        let end = false;
        while (!end) {
            if (result.done) {
                end = true;
            }
            let asset;
            const buffer = (result.value.value).toBuffer(); // ByteBuffer
            try {
                asset = JSON.parse(buffer.toString()); // Asset
            } catch (err) {
                console.log(err);
                asset = buffer;
            }
            assetsArray.push({ Key: result.value.key, Asset: asset }); // {Key, Asset}
            result = await iterator.next();
        }
        return JSON.stringify(assetsArray);
    }

}

module.exports = AtivoTrocaContract;