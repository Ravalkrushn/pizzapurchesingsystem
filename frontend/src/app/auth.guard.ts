import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthserviceService } from './authservice.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  if (authService.adminloggedin) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const restGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  if (authService.restloggedin) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const custGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthserviceService);
  const router = inject(Router);

  if (authService.custloggedin) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
