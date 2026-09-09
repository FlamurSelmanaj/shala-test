import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/** Gates the admin shell — redirects to `/admin/login` when no valid token is held. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) {
    return true;
  }
  return inject(Router).parseUrl('/admin/login');
};
