import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './middleware/auth.guard';

const routes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./feature/authentication/authentication.component')).AuthenticationComponent
    },
    {
        path: 'beranda',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./feature/beranda/beranda.component')).BerandaComponent
    },
    {
        path: 'setup-lokasi',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./feature/setup-lokasi/setup-lokasi.component')).SetupLokasiComponent
    },
    {
        path: 'setup-satuan',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./feature/setup-satuan/setup-satuan.component')).SetupSatuanComponent
    },
    {
        path: 'setup-barang',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./feature/setup-barang/setup-barang.component')).SetupBarangComponent
    },
    {
        path: 'setup-metode-bayar',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./feature/setup-metode-bayar/setup-metode-bayar.component')).SetupMetodeBayarComponent
    },
    {
        path: 'setup-bank',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./feature/setup-bank/setup-bank.component')).SetupBankComponent
    },
    {
        path: 'pos-kasir',
        canActivate: [AuthGuard],
        loadComponent: async () => (await import('./feature/pos-kasir/pos-kasir.component')).PosKasirComponent
    },
    {
        path: 'penjualan',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'laporan',
                loadComponent: async () => (await import('./feature/penjualan/penjualan.component')).PenjualanComponent
            },
            {
                path: 'print-out/:id',
                loadComponent: async () => (await import('./components/print-out-struk/print-out-struk.component')).PrintOutStrukComponent
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
