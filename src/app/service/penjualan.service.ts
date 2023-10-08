import { Injectable } from '@angular/core';
import { db } from '../db/db';
import { DbModel } from '../db/db.model';

@Injectable({
    providedIn: 'root'
})
export class PenjualanService {

    constructor() { }

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
            const result: any[] = await db.penjualan.where({
                id_penjualan: id_penjualan,
            }).toArray();

            if (result.length) {
                const data = {
                    ...result[0],
                    detail: await this.getDetailPenjualan(id_penjualan)
                }

                return [true, data]
            } else {
                return [false, null as any]
            }

        } catch (error) {
            throw error;
        }
    }

    async getDetailPenjualan(id_penjualan: number): Promise<[boolean, DbModel.PenjualanDetail[]]> {
        try {
            const result: any[] = await db.penjualanDetail.where({
                id_penjualan: id_penjualan,
            }).toArray();

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async getDetailPayment(id_penjualan: number): Promise<[boolean, DbModel.PenjualanDetailPayment[]]> {
        try {
            const result: any[] = await db.penjualanDetailPayment
                .where({ id_penjualan: id_penjualan })
                .toArray();

            if (result) {
                return [true, result]
            } else {
                return [false, []]
            }

        } catch (error) {
            throw error;
        }
    }

    async insert(data: any): Promise<[boolean, string]> {
        try {
            const result = await db.penjualan.add({
                tanggal_penjualan: data.tanggal_penjualan,
                no_faktur: data.no_faktur ? data.no_faktur : '',
                nama_customer: data.nama_customer ? data.nama_customer : '',
                jumlah_item: data.jumlah_item,
                grand_total: data.grand_total,
                keterangan: data.keterangan ? data.keterangan : "",
            });

            if (result > 0) {
                const detail = data.detail.map((item: any) => {
                    return {
                        id_penjualan: result,
                        ...item
                    }
                });

                const resultDetail = await db.penjualanDetail.bulkAdd(detail);

                if (resultDetail) {

                    const detailPayment = data.detail_payment.map((item: any) => {
                        return {
                            id_penjualan: result,
                            ...item
                        }
                    });

                    const resultDetailPayment = await db.penjualanDetailPayment.bulkAdd(detailPayment);

                    if (resultDetailPayment) {
                        return [true, "Data Berhasil Disimpan"];
                    } else {
                        return [false, "Data Payment Gagal Disimpan"];
                    }

                } else {
                    return [false, "Data Detail Gagal Disimpan"]
                }

            } else {
                return [false, "Data Gagal Disimpan"];
            }

        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<[boolean, string]> {
        try {
            const detailPenjualan = await this.getDetailPenjualan(id);

            if (detailPenjualan[0]) {
                for (const item of detailPenjualan[1]) {
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
}
