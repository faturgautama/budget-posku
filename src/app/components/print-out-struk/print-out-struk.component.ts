import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LokasiService } from 'src/app/service/lokasi.service';
import { PenjualanService } from 'src/app/service/penjualan.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-print-out-struk',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './print-out-struk.component.html',
    styleUrls: ['./print-out-struk.component.scss']
})
export class PrintOutStrukComponent implements AfterViewInit {

    Lokasi: any;

    Penjualan: any;

    Loading = new BehaviorSubject(false);

    constructor(
        private _lokasiService: LokasiService,
        private _activatedRoute: ActivatedRoute,
        private _penjualanService: PenjualanService
    ) { }

    ngAfterViewInit(): void {
        this.Loading.next(true);

        setTimeout(() => {
            this.getLokasi();
            this.getDetail();
        }, 250);

        this.Loading.subscribe((result) => {
            if (!result) {
                setTimeout(() => {
                    window.print();
                }, 200);
            }
        })
    }

    getLokasi(): void {
        this._lokasiService.getAll()
            .then((result) => {
                if (result[0]) {
                    this.Lokasi = result[1];
                }
            })
    }

    getDetail(): void {
        const id = this._activatedRoute.snapshot.params['id'];

        this._penjualanService.getDetail(id)
            .then((result) => {
                if (result[0]) {
                    this.Penjualan = result[1];
                }
            }).finally(() => {
                this.Loading.next(false)
            })
    }
}
