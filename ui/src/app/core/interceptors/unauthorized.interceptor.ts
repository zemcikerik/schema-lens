import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { catchSpecificHttpStatusError } from '../rxjs-pipes';
import { defer, mergeMap, of, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const SKIP_UNAUTHORIZED_REDIRECT = new HttpContextToken<boolean>(() => false);

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const skipRedirect = req.context.get(SKIP_UNAUTHORIZED_REDIRECT);
  const router = inject(Router);

  return next(req).pipe(
    catchSpecificHttpStatusError(401, err => {
      const redirect$ = skipRedirect ? of(false) : defer(() => router.navigate(['/login']));
      return redirect$.pipe(mergeMap(() => throwError(() => err)));
    }),
  );
};
