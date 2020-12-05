/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { SCTIEContract} from './teste-asset';

@Info({title: 'TesteAssetContract', description: 'My Smart Contract' })
export class TesteAssetContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async testeAssetExists(ctx: Context, testeAssetId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(testeAssetId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createTesteAsset(ctx: Context, testeAssetId: string, vendedor: string, comprador: string, quantidade: number, produto: string, valor: number, dataVencimento: string): Promise<void> {
        const exists = await this.testeAssetExists(ctx, testeAssetId);
        if (exists) {
            throw new Error(`The teste asset ${testeAssetId} already exists`);
        }
        const testeAsset = new SCTIEContract();
        testeAsset.vendedor = vendedor;
        testeAsset.comprador = comprador;
        testeAsset.quantidade = quantidade;
        testeAsset.produto = produto;
        testeAsset.valor = valor;
        testeAsset.dataVencimento = dataVencimento;
        testeAsset.pago = false;
        const buffer = Buffer.from(JSON.stringify(testeAsset));
        await ctx.stub.putState(testeAssetId, buffer);
    }

    @Transaction(false)
    @Returns('SCTIEContract')
    public async readTesteAsset(ctx: Context, testeAssetId: string): Promise<SCTIEContract> {
        const exists = await this.testeAssetExists(ctx, testeAssetId);
        if (!exists) {
            throw new Error(`The teste asset ${testeAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(testeAssetId);
        const testeAsset = JSON.parse(buffer.toString()) as SCTIEContract;
        return testeAsset;
    }

    @Transaction()
    public async updateDataTesteAsset(ctx: Context, testeAssetId: string, dataVencimento: string): Promise<void> {
        const exists = await this.testeAssetExists(ctx, testeAssetId);
        if (!exists) {
            throw new Error(`The teste asset ${testeAssetId} does not exist`);
        }
        const PreBuffer = await ctx.stub.getState(testeAssetId);
        const testeAsset = new SCTIEContract();
        testeAsset.vendedor = PreBuffer['vendedor'];
        testeAsset.comprador = PreBuffer['comprador'];
        testeAsset.quantidade = PreBuffer['quantidade'];
        testeAsset.produto = PreBuffer['produto'];
        testeAsset.valor = PreBuffer['valor'];
        testeAsset.dataVencimento = dataVencimento;
        testeAsset.pago = PreBuffer['pago'];       
        const buffer = Buffer.from(JSON.stringify(testeAsset));
        await ctx.stub.putState(testeAssetId, buffer);
    }

    @Transaction()
    public async updatePagoTesteAsset(ctx: Context, testeAssetId: string): Promise<void> {
        const exists = await this.testeAssetExists(ctx, testeAssetId);
        if (!exists) {
            throw new Error(`The teste asset ${testeAssetId} does not exist`);
        }
        const PreBuffer = await ctx.stub.getState(testeAssetId);
        console.log(PreBuffer);
        const testeAsset = new SCTIEContract();
        testeAsset.vendedor = PreBuffer['vendedor'];
        testeAsset.comprador = PreBuffer['comprador'];
        testeAsset.quantidade = PreBuffer['quantidade'];
        testeAsset.produto = PreBuffer['produto'];
        testeAsset.valor = PreBuffer['valor'];
        testeAsset.dataVencimento = PreBuffer['dataVencimento'];
        testeAsset.pago = !PreBuffer['pago'];       
        const buffer = Buffer.from(JSON.stringify(testeAsset));
        await ctx.stub.putState(testeAssetId, buffer);
    }


    @Transaction()
    public async deleteTesteAsset(ctx: Context, testeAssetId: string): Promise<void> {
        const exists = await this.testeAssetExists(ctx, testeAssetId);
        if (!exists) {
            throw new Error(`The teste asset ${testeAssetId} does not exist`);
        }
        await ctx.stub.deleteState(testeAssetId);
    }

    @Transaction()
    @Returns('SCTIEContract')
    public async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: result.value.key, Record: record });
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
    
}