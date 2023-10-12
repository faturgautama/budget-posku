import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const AuthGuard = () => {
    const router = inject(Router);
    const user = localStorage.getItem('_BGPSUD_');

    if (user) {
        return true;
    }

    return router.navigate(['']);
}