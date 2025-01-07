import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { mergeMap } from 'rxjs';

export const NO_AUTHORIZATION = new HttpContextToken<boolean>(() => false);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const noAuthorization = req.context.get(NO_AUTHORIZATION);

  if (noAuthorization || !req.url.startsWith('/')) {
    return next(req);
  }

  return inject(AuthService).getJwtToken().pipe(mergeMap(jwt => {
    if (jwt === null) {
      return next(req);
    }

    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${jwt}`,
      },
    });

    return next(req);
  }));
};
