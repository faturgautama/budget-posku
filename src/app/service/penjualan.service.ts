import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { DbModel } from '../db/db.model';
import { KartuStokService } from './kartu-stok.service';
import { BarangService } from './barang.service';

@Injectable({
    providedIn: 'root'
})
export class PenjualanService {

    constructor(
        private _barangService: BarangService,
        private _kartuStokService: KartuStokService,
    ) { }

    async getAll(): Promise<[boolean, DbModel.Penjualan[]]> {
        try {
            const result: any[] = await db.penjualan.toArray();

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async getDetail(id_penjualan: number): Promise<[boolean, DbModel.Penjualan]> {
        try {
            const result: any = await db.penjualan.get(parseInt(id_penjualan as any));

            if (result) {
                const data = {
                    ...result,
                    detail: await this.getDetailPenjualan(parseInt(id_penjualan as any)),
                    detail_payment: await this.getDetailPayment(parseInt(id_penjualan as any))
                }

                return [true, data]
            } else {
                return [false, null as any]
            }

        } catch (error) {
            throw error;
        }
    }

    async getDetailPenjualan(id_penjualan: number): Promise<DbModel.PenjualanDetail[]> {
        try {
            const detail: any[] = await db.penjualanDetail
                .where({ id_penjualan: parseInt(id_penjualan as any) })
                .toArray()

            let result: any[] = [];

            for (const item of detail) {
                const barang = await this._barangService.getById(item.id_barang);

                result.push({
                    ...item,
                    nama_barang: barang[1].nama_barang,
                    barcode: barang[1].barcode,
                    nama_satuan: barang[1].nama_satuan,
                })
            }

            if (!result) {
                return [];
            }

            return result;

        } catch (error) {
            throw error;
        }
    }

    async getDetailPayment(id_penjualan: number): Promise<DbModel.PenjualanDetailPayment[]> {
        try {
            const payment_method = await db.metodeBayar.toArray();
            const bank = await db.bank.toArray();

            const result: any[] = await db.penjualanDetailPayment
                .where({ id_penjualan: parseInt(id_penjualan as any) })
                .toArray()
                .then((payment) => {
                    return payment.map((item) => {
                        const metode_bayar = payment_method.find((pym) => { return pym.id == item.id_metode_bayar })?.metode_bayar;
                        const nama_bank = bank.find((pym) => { return pym.id == item.id_bank })?.bank;

                        const payload = {
                            ...item,
                            metode_bayar: metode_bayar,
                            bank: nama_bank,
                        };

                        return payload;
                    })
                })

            if (result) {
                return result
            } else {
                return []
            }

        } catch (error) {
            throw error;
        }
    }

    async insert(data: any): Promise<[boolean, any]> {
        try {
            const result = await db.penjualan.add({
                tanggal_penjualan: data.tanggal_penjualan,
                no_faktur: data.no_faktur,
                nama_customer: data.nama_customer ? data.nama_customer : '',
                jumlah_item: data.jumlah_item,
                grand_total: data.grand_total,
                ppn_persen: data.ppn_persen,
                ppn_rupiah: data.ppn_rupiah,
                biaya_lain: data.biaya_lain,
                total_transaksi: data.total_transaksi,
                keterangan: data.keterangan ? data.keterangan : "",
                status: "OPEN",
            });

            if (!result) {
                return [false, "Penjualan Gagal Disimpan"];
            };

            for (let i = 0; i < data.detail.length; i++) {
                const insertDetail = await db.penjualanDetail.add({
                    id_penjualan: result,
                    id_barang: data.detail[i].id_barang,
                    qty: data.detail[i].qty,
                    harga_jual: data.detail[i].harga_jual,
                    total: data.detail[i].total,
                });

                if (!insertDetail) {
                    return [false, "Detail Penjualan Gagal Disimpan"];
                }

                const insertKartuStok = await this._kartuStokService.updateNilaiKeluarBarang(data.detail[i].id_barang, result, data.detail[i].qty, 'KELUAR PENJUALAN');

                if (!insertKartuStok[0]) {
                    return [false, "Kartu Stok Gagal Disimpan"];
                }
            }

            for (let i = 0; i < data.detail_payment.length; i++) {
                const insertDetail = await db.penjualanDetailPayment.add({
                    id_penjualan: result,
                    id_metode_bayar: data.detail_payment[i].id_metode_bayar,
                    id_bank: data.detail_payment[i].id_bank,
                    total: data.detail_payment[i].total,
                    diskon_persen: data.detail_payment[i].diskon_persen,
                    diskon_rupiah: data.detail_payment[i].diskon_rupiah,
                    total_payment_method: data.detail_payment[i].total_payment_method,
                    jumlah_bayar: data.detail_payment[i].jumlah_bayar,
                    kembalian: data.detail_payment[i].kembalian,
                });

                if (!insertDetail) {
                    return [false, "Detail Payment Gagal Disimpan"];
                }
            }

            const updateCounter = await this.updateCounter();

            if (!updateCounter) {
                return [false, "Gagal Update Counter"];
                // throw new Error("Gagal Update Counter");
            }

            return [true, result];
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<[boolean, string]> {
        try {
            const detailPenjualan = await this.getDetailPenjualan(id);

            if (detailPenjualan[0]) {
                for (const item of detailPenjualan) {
                    await db.penjualanDetail.delete(item.id as number);
                }

                const result: any = await db.penjualan.delete(id);

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
        const counter = await db.counter.where({
            prefix: 'PJ'
        }).toArray();

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

            no_faktur = `PJ-${counting}`;
        } else {
            const counter = await db.counter.add({
                counter: 0,
                prefix: 'PJ'
            });

            if (counter) {
                no_faktur = `PJ-0001`;
            }
        }

        return no_faktur;
    }

    async updateCounter(): Promise<any> {
        const counter = await db.counter.where({
            prefix: 'PJ'
        }).toArray();

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
