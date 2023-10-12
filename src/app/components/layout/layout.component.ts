import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SupabaseService } from 'src/app/service/supabase.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        CommonModule,
        AvatarModule
    ],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

    UserData: any = JSON.parse(localStorage.getItem('_BGPSUD_') as any);

    Menu: any[] = [
        {
            path: 'beranda',
            title: 'Beranda',
            icon: 'pi pi-home'
        },
        {
            path: 'setup-lokasi',
            title: 'Setup Lokasi',
            icon: 'pi pi-building'
        },
        {
            path: 'setup-satuan',
            title: 'Setup Satuan',
            icon: 'pi pi-qrcode'
        },
        {
            path: 'setup-barang',
            title: 'Setup Produk',
            icon: 'pi pi-box'
        },
        {
            path: 'setup-metode-bayar',
            title: 'Setup Metode Bayar',
            icon: 'pi pi-sitemap'
        },
        {
            path: 'setup-bank',
            title: 'Setup Bank',
            icon: 'pi pi-credit-card'
        },
        {
            path: 'pos-kasir',
            title: 'POS Kasir',
            icon: 'pi pi-desktop'
        },
        {
            path: 'penjualan/laporan',
            title: 'Laporan Penjualan',
            icon: 'pi pi-file'
        },
    ]

    constructor(
        private _router: Router,
        private _supabaseService: SupabaseService,
    ) { }

    handleHover(type: string): void {
        const sidebar = document.getElementById('sidebar') as HTMLElement;
        const divMenus = document.getElementsByClassName('divMenus') as any;
        const menus = document.getElementsByClassName('menus') as any;

        setTimeout(() => {
            if (type == 'enter') {
                sidebar.classList.remove('w-16');
                sidebar.classList.add('w-3/12');

                for (const item of divMenus) {
                    item.classList.remove('justify-center');
                }

                for (const item of menus) {
                    item.classList.remove('onlyIcon');
                }
            } else {
                sidebar.classList.remove('w-3/12');
                sidebar.classList.add('w-16');

                for (const item of divMenus) {
                    item.classList.add('justify-center');
                }

                for (const item of menus) {
                    item.classList.add('onlyIcon')
                }
            }
        }, 250);
    }

    handleNavigate(url: string): void {
        this._router.navigateByUrl(url);
    }

    handleSignOut(): void {
        this._supabaseService.handleSignOut();
    }
}
