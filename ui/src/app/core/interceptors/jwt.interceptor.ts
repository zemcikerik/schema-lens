import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return req.url.startsWith('/') && authService.jwt
    ? next(req.clone({
        setHeaders: {
          'Authorization': `Bearer ${authService.jwt}`,
        },
      }))
    : next(req);
};
