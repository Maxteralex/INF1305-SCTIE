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
        testeAsset.vendedor = PreBuffer[0];
        testeAsset.comprador = PreBuffer[1];
        testeAsset.quantidade = PreBuffer[2];
        testeAsset.produto = PreBuffer[3];
        testeAsset.valor = PreBuffer[4];
        testeAsset.dataVencimento = dataVencimento;
        testeAsset.pago = PreBuffer[6];       
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
        const testeAsset = new SCTIEContract();
        testeAsset.vendedor = PreBuffer[0];
        testeAsset.comprador = PreBuffer[1];
        testeAsset.quantidade = PreBuffer[2];
        testeAsset.produto = PreBuffer[3];
        testeAsset.valor = PreBuffer[4];
        testeAsset.dataVencimento = PreBuffer[5];
        testeAsset.pago = !PreBuffer[6];       
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

}
