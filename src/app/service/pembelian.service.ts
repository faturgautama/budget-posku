import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { DbModel } from '../db/db.model';
import { KartuStokService } from './kartu-stok.service';

@Injectable({
    providedIn: 'root'
})
export class PembelianService {

    constructor(
        private _kartuStokService: KartuStokService,
    ) { }

    async getAll(): Promise<[boolean, DbModel.Pembelian[]]> {
        try {
            const result: any[] = await db.pembelian.toArray();

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async getDetail(id_pembelian: number): Promise<[boolean, DbModel.Pembelian]> {
        try {
            const result: any = await db.pembelian.get(parseInt(id_pembelian as any));

            if (result) {
                const data = {
                    ...result,
                    detail: await this.getDetailPembelian(parseInt(id_pembelian as any)),
                }

                return [true, data]
            } else {
                return [false, null as any]
            }

        } catch (error) {
            throw error;
        }
    }

    async getDetailPembelian(id_pembelian: number): Promise<[boolean, DbModel.PembelianDetail[]]> {
        try {
            const result: any[] = await db.pembelianDetail
                .where({ id_pembelian: parseInt(id_pembelian as any) })
                .toArray()

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async insert(data: any): Promise<[boolean, any]> {
        try {
            return db.transaction('rw', db.pembelian, db.pembelianDetail, async () => {
                const result = await db.pembelian.add({
                    tanggal_pembelian: data.tanggal_pembelian,
                    no_faktur: data.no_faktur,
                    nama_supplier: data.nama_supplier ? data.nama_supplier : '',
                    jumlah_item: data.jumlah_item,
                    grand_total: data.grand_total,
                    keterangan: data.keterangan ? data.keterangan : "",
                });

                if (!result) {
                    // return [false, "Data Gagal Disimpan"];
                    throw new Error("Pembelian Gagal Disimpan");
                }

                const detail = data.detail.map(async (item: any) => {
                    const insertKartuStok = await this._kartuStokService.updateNilaiMasukBarang(item.id_barang, result, item.qty);

                    if (!insertKartuStok[0]) {
                        throw new Error("Kartu Stok Gagal Disimpan");
                    }

                    return {
                        id_pembelian: result,
                        ...item
                    }
                });

                const resultDetail = await db.pembelianDetail.bulkAdd(detail);

                if (!resultDetail) {
                    // return [false, "Data Detail Gagal Disimpan"];
                    throw new Error("Pembelian Detail Gagal Disimpan");
                }

                const updateCounter = await this.updateCounter();

                if (!updateCounter) {
                    // return [false, "Gagal Update Counter"];
                    throw new Error("Gagal Update Counter");
                }

                return [true, result];
            })
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<[boolean, string]> {
        try {
            const detailPembelian = await this.getDetailPembelian(id);

            if (detailPembelian[0]) {
                for (const item of detailPembelian[1]) {
                    await db.pembelianDetail.delete(item.id as number);
                }

                const result: any = await db.pembelian.delete(id);

                if (result) {
                    return [true, "Data Berhasil Dihapus"]
                } else {
                    return [false, "Data Gagal Dihapus"];
                }

            } else {
                return [false, "Data Gagal Dihapus"];
            }

        } catch (error) {
            throw error;
        }
    }

    async generateNoFaktur(): Promise<string> {
        const counter = await db.counter
            .where({ prefix: 'PB' })
            .toArray();

        let no_faktur = ''

        if (counter.length) {
            let counting = "";

            if (counter[0].counter < 10) {
                counting = `000${counter[0].counter + 1}`
            } else if (counter[0].counter < 100) {
                counting = `00${counter[0].counter + 1}`
            } else if (counter[0].counter < 1000) {
                counting = `0${counter[0].counter + 1}`
            } else {
                counting = `${counter[0].counter + 1}`
            }

            no_faktur = `PB-${counting}`;
        } else {
            const counter = await db.counter.add({
                counter: 0,
                prefix: 'PB'
            });

            if (counter) {
                no_faktur = `PB-0001`;
            }
        }

        return no_faktur;
    }

    async updateCounter(): Promise<any> {
        const counter = await db.counter
            .where({ prefix: 'PB' })
            .toArray();

        if (counter.length) {
            const result = await db.counter.put({
                id: counter[0].id,
                prefix: counter[0].prefix,
                counter: counter[0].counter + 1,
            })

            return result ? true : false;

        } else {
            return false;
        }
    }
}
