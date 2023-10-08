import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('./feature/authentication/authentication.component')).AuthenticationComponent
    },
    {
        path: 'beranda',
        loadComponent: async () => (await import('./feature/beranda/beranda.component')).BerandaComponent
    },
    {
        path: 'setup-lokasi',
        loadComponent: async () => (await import('./feature/setup-lokasi/setup-lokasi.component')).SetupLokasiComponent
    },
    {
        path: 'setup-satuan',
        loadComponent: async () => (await import('./feature/setup-satuan/setup-satuan.component')).SetupSatuanComponent
    },
    {
        path: 'setup-barang',
        loadComponent: async () => (await import('./feature/setup-barang/setup-barang.component')).SetupBarangComponent
    },
    {
        path: 'setup-metode-bayar',
        loadComponent: async () => (await import('./feature/setup-metode-bayar/setup-metode-bayar.component')).SetupMetodeBayarComponent
    },
    {
        path: 'setup-bank',
        loadComponent: async () => (await import('./feature/setup-bank/setup-bank.component')).SetupBankComponent
    },
    {
        path: 'pos-kasir',
        loadComponent: async () => (await import('./feature/pos-kasir/pos-kasir.component')).PosKasirComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
