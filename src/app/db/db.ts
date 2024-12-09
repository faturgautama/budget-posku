import Dexie, { Table } from 'dexie';
import { DbModel } from './db.model';

export class AppDB extends Dexie {
    lokasi!: Table<DbModel.Lokasi, number>;
    satuan!: Table<DbModel.Satuan, number>;
    barang!: Table<DbModel.Barang, number>;
    metodeBayar!: Table<DbModel.MetodeBayar, number>;
    bank!: Table<DbModel.Bank, number>;
    penjualan!: Table<DbModel.Penjualan, number>;
    penjualanDetail!: Table<DbModel.PenjualanDetail, number>;
    penjualanDetailPayment!: Table<DbModel.PenjualanDetailPayment, number>;
    pembelian!: Table<DbModel.Pembelian, number>;
    pembelianDetail!: Table<DbModel.PembelianDetail, number>;
    kartuStok!: Table<DbModel.KartuStok, number>;
    saldoBarang!: Table<DbModel.StokBarang, number>;
    counter!: Table<DbModel.Counter, number>;

    constructor() {
        super('ngdexielivequery');
        this.version(3).stores({
            lokasi: '++id',
            satuan: '++id',
            barang: '++id, id_satuan, nama_barang, barcode',
            metodeBayar: '++id',
            bank: '++id',
            penjualan: '++id',
            penjualanDetail: '++id, id_penjualan, id_barang',
            penjualanDetailPayment: '++id, id_penjualan',
            pembelian: '++id',
            pembelianDetail: '++id, id_pembelian, id_barang',
            kartuStok: '++id, id_barang',
            saldoBarang: '++id, id_barang',
            counter: '++id, prefix',
        });

        this.on('populate', () => this.populate());
    }

    async populate() {
        // await db.saldoBarang.add({
        //     id: 1,
        //     id_barang: 0,
        //     sisa_stok: 0,
        // });

        console.log(db.saldoBarang.toArray());
    }
}

export const db = new AppDB();