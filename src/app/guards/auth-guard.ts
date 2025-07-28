import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    const userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const allowedRoles: string[] = route.data?.['roles'];

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      router.navigate(['/error'], { queryParams: { message: 'Access Denied' } });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token", error);
    router.navigate(['/login']);
    return false;
  }
};
