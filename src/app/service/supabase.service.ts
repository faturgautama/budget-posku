import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {

    private supabaseClient: SupabaseClient;

    // ** Email s*********er8@gmail.com
    private supabaseUrl = 'https://bmleshdonhvvyfgrhxgi.supabase.co';

    constructor(
        private router: Router,
        private _messageService: MessageService,
    ) {
        const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbGVzaGRvbmh2dnlmZ3JoeGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyNTMwMTIsImV4cCI6MjA0NTgyOTAxMn0.N-BgEfhK1Byzs_YShOOb3u48krnWXWqbMsZoIemsDKw'
        this.supabaseClient = createClient(this.supabaseUrl, key)
    }

    async checkUser(email: string, password: string): Promise<any> {
        try {
            const result: any = await this.supabaseClient.from('user').select("*").eq('email', email);

            if (result) {
                if (result.data[0].password === password) {
                    const user = {
                        id: result.data[0].id,
                        full_name: result.data[0].full_name,
                        email: result.data[0].email
                    };

                    await this.supabaseClient
                        .from('user')
                        .update({
                            last_login: new Date()
                        })
                        .eq('id', result.data[0].id)
                        .select()

                    return [true, user];
                } else {
                    return [false, "Mohon Cek Email / Password Anda"];

                }
            } else {
                return [false, result.error.message]
            }
        } catch (error) {
            throw error;
        }
    }

    handleSignOut(): void {
        this._messageService.clear();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Sign Out Berhasil' });

        localStorage.removeItem("_BGPSUD_");

        setTimeout(() => {
            this.router.navigateByUrl("");
        }, 1500);
    }
}
