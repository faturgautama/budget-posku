import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { UtilityService } from 'src/app/service/utility.service';
import { HttpClientModule } from '@angular/common/http';
import { LokasiService } from 'src/app/service/lokasi.service';
import { from, map } from 'rxjs';
import { db } from 'src/app/db/db';
import { importDB } from 'dexie-export-import';
import { MessageService } from 'primeng/api';
import { SupabaseService } from 'src/app/service/supabase.service';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-beranda',
    standalone: true,
    imports: [
        CommonModule,
        LayoutComponent,
        ButtonModule,
        FileUploadModule,
        HttpClientModule,
        ChartModule
    ],
    templateUrl: './beranda.component.html',
    styleUrls: ['./beranda.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BerandaComponent implements OnInit {

    UserData = JSON.parse(localStorage.getItem('_BGPSUD_') as any);

    Lokasi$ = from(this._lokasiService.getAll()).pipe(
        map((result) => {
            if (result[0]) {
                return result[1];
            } else {
                return {} as any;
            }
        })
    );

    basicData: any;

    basicOptions: any;

    DbFiles: any[] = [];

    constructor(
        private _lokasiService: LokasiService,
        private _messageService: MessageService,
        private _utilityService: UtilityService,
        private _supabaseService: SupabaseService,
    ) { }

    ngOnInit(): void {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [
                {
                    label: 'Sales',
                    data: [540, 325, 702, 620],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
                    borderWidth: 1
                }
            ]
        };

        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    async exportDatabase() {
        try {
            await this._utilityService.exportDatabase();
        } catch (error) {
            throw error;
        }
    }

    async importDatabase(args: any) {
        try {
            for (let file of args.files) {
                this.DbFiles.push(file);
            }

            if (args.files.length) {
                const files = args.files[0];
                await db.delete();

                const result = await importDB(files);

                if (result) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Database Berhasil Diimport' });

                    setTimeout(() => {
                        this._messageService.add({ severity: 'success', summary: 'Refresh', detail: 'Untuk Memuat Ulang Database' });
                    }, 1500);

                    setTimeout(() => {
                        window.location.reload();
                    }, 2200);
                }
            }

        } catch (error) {
            throw error;
        }
    }
}
