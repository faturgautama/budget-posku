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
            const result = await db.pembelian.add({
                tanggal_pembelian: data.tanggal_pembelian,
                no_faktur: data.no_faktur,
                nama_supplier: data.nama_supplier ? data.nama_supplier : '',
                jumlah_item: data.jumlah_item,
                grand_total: data.grand_total,
                keterangan: data.keterangan ? data.keterangan : "",
                status: "OPEN",
            });

            if (!result) {
                return [false, "Data Gagal Disimpan"];
            }

            for (let i = 0; i < data.detail.length; i++) {
                const insertDetail = await db.pembelianDetail.add({
                    id_pembelian: result,
                    id_barang: data.detail[i].id_barang,
                    qty: data.detail[i].qty,
                    harga_beli: data.detail[i].harga_beli,
                    total: data.detail[i].total,
                });

                if (!insertDetail) {
                    return [false, "Detail Pembelian Gagal Disimpan"];
                }

                const insertKartuStok = await this._kartuStokService.updateNilaiMasukBarang(data.detail[i].id_barang, result, data.detail[i].qty, 'MASUK PEMBELIAN');

                if (!insertKartuStok[0]) {
                    return [false, "Kartu Stok Gagal Disimpan"];
                }
            }

            const updateCounter = await this.updateCounter();

            if (!updateCounter) {
                return [false, "Gagal Update Counter"];
            }

            return [true, result];

        } catch (error) {
            throw error;
        }
    }

    async cancel(id: number): Promise<[boolean, string]> {
        try {
            const updateStatusPembelian = await db.pembelian.update(id, { status: "CANCEL" });

            if (!updateStatusPembelian) {
                return [false, "Gagal Cancel Pembelian"];
            }

            const detail = await db.pembelianDetail
                .where({ id_pembelian: id })
                .toArray();

            for (let i = 0; i < detail.length; i++) {
                const insertKartuStok = await this._kartuStokService.updateNilaiKeluarBarang(detail[i].id_barang, id, parseInt(detail[i].qty), 'KELUAR BATAL PEMBELIAN');

                if (!insertKartuStok[0]) {
                    return [false, "Kartu Stok Gagal Disimpan"];
                }
            }

            return [true, "Pembelian Berhasil Dibatalkan"]

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
