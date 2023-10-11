import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LokasiService } from 'src/app/service/lokasi.service';
import { PenjualanService } from 'src/app/service/penjualan.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-print-out-struk',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './print-out-struk.component.html',
    styleUrls: ['./print-out-struk.component.scss']
})
export class PrintOutStrukComponent implements AfterViewInit {

    constructor(
        private _lokasiService: LokasiService,
        private _activatedRoute: ActivatedRoute,
        private _penjualanService: PenjualanService
    ) { }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.getLokasi();
            this.getDetail();
        }, 1000);
    }

    getLokasi(): void {
        this._lokasiService.getAll()
            .then((result) => {
                if (result[0]) {
                    console.log("LOKASI =>", result[1])
                }
            })
    }

    getDetail(): void {
        const id = this._activatedRoute.snapshot.params['id'];

        this._penjualanService.getDetail(id).then((result) => {
            if (result[0]) {
                console.log("DETAIL =>", result[1]);
            }
        })
    }
}
