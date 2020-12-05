/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class SCTIEContract {

    @Property()
    public vendedor: string;
    public comprador: string;
    public quantidade: number;
    public produto: string;
    public valor: number;
    public dataVencimento: string;
    public pago: boolean;
}
