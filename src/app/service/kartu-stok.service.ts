import { Injectable } from '@angular/core';
import { DbModel } from '../db/db.model';
import { db } from '../db/db';
import { BarangService } from './barang.service';

@Injectable({
    providedIn: 'root'
})
export class KartuStokService {

    constructor(
        private _barangService: BarangService
    ) { }

    async getSaldoStokBarang(): Promise<[boolean, DbModel.StokBarang[]]> {
        try {
            console.log(db.saldoBarang);

            const result: any[] = await db.saldoBarang
                .toArray()
                .then((item) => {
                    return item.map(async (data) => {
                        let result: any = {};

                        const barang = await this._barangService.getById(data.id_barang);

                        if (barang[0]) {
                            result = {
                                ...data,
                                ...barang[1]
                            }
                        } else {
                            result = { ...data };
                        }

                        return result;
                    })
                });

            console.log("saldo stok =>", result);

            if (!result) {
                return [false, []]
            }

            return [true, result];

        } catch (error) {
            throw error;
        }
    }

    async getKartuStokBarang(id_barang: number): Promise<[boolean, DbModel.KartuStok[]]> {
        try {
            const result: any[] = await db.kartuStok
                .where({ id_barang: id_barang })
                .toArray()
                .then((item) => {
                    return item.map(async (data) => {
                        let result: any = {};

                        const barang = await this._barangService.getById(data.id_barang);

                        if (barang[0]) {
                            result = {
                                ...data,
                                ...barang[1]
                            }
                        } else {
                            result = { ...data };
                        }

                        return result;
                    })
                })

            if (!result) {
                return [false, []]
            }

            return [true, result.length ? result[0] : null];

        } catch (error) {
            throw error;
        }
    }

    async updateNilaiMasukBarang(id_barang: number, ref_id: number, nilai_masuk: number): Promise<[boolean, string]> {
        try {
            return db.transaction('rw', db.kartuStok, db.saldoBarang, async () => {
                const lastKartuStok = await db.kartuStok
                    .where({ id_barang: id_barang })
                    .sortBy('created_at');

                let saldo_akhir = 0;

                if (!lastKartuStok.length) {
                    saldo_akhir = lastKartuStok.length ? lastKartuStok[lastKartuStok.length - 1].saldo_akhir! : 0;
                };

                const result = await db.kartuStok.add({
                    id_barang: id_barang,
                    ref_id: ref_id,
                    saldo_awal: saldo_akhir,
                    nilai_masuk: nilai_masuk,
                    nilai_keluar: 0,
                    saldo_akhir: saldo_akhir + nilai_masuk,
                    keterangan: 'MASUK PEMBELIAN',
                    created_at: new Date(),
                });

                if (!result) {
                    throw new Error("Kartu Stok Gagal Disimpan");
                }

                const findSaldoStok = await db.saldoBarang
                    .where({ id_barang: id_barang })
                    .first();

                const updateSaldoStok = await db.saldoBarang.put({
                    id: findSaldoStok?.id,
                    id_barang: id_barang,
                    sisa_stok: saldo_akhir + nilai_masuk
                });

                if (!updateSaldoStok) {
                    throw new Error("Saldo Stok Gagal Diperbarui");
                }

                return [true, "Kartu Stok Berhasil Disimpan"];
            })

        } catch (error) {
            throw error;
        }
    }

    async updateNilaiKeluarBarang(id_barang: number, ref_id: number, nilai_keluar: number): Promise<[boolean, string]> {
        try {
            return db.transaction('rw', db.kartuStok, db.saldoBarang, async () => {
                const lastKartuStok = await db.kartuStok
                    .where({ id_barang: id_barang })
                    .sortBy('created_at');

                let saldo_akhir = 0;

                if (!lastKartuStok.length) {
                    saldo_akhir = lastKartuStok.length ? lastKartuStok[lastKartuStok.length - 1].saldo_akhir! : 0;
                };

                const result = await db.kartuStok.add({
                    id_barang: id_barang,
                    ref_id: ref_id,
                    saldo_awal: saldo_akhir,
                    nilai_masuk: 0,
                    nilai_keluar: nilai_keluar,
                    saldo_akhir: saldo_akhir - nilai_keluar,
                    keterangan: 'KELUAR PENJUALAN',
                    created_at: new Date(),
                });

                if (!result) {
                    throw new Error("Kartu Stok Gagal Disimpan");
                }

                const findSaldoStok = await db.saldoBarang
                    .where({ id_barang: id_barang })
                    .first();

                const updateSaldoStok = await db.saldoBarang.put({
                    id: findSaldoStok?.id,
                    id_barang: id_barang,
                    sisa_stok: saldo_akhir - nilai_keluar
                });

                if (!updateSaldoStok) {
                    throw new Error("Saldo Stok Gagal Diperbarui");
                }

                return [true, "Kartu Stok Berhasil Disimpan"];
            })

        } catch (error) {
            throw error;
        }
    }
}
