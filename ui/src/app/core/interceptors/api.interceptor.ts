import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('/')) {
    req = req.clone({
      url: `/api${req.url}`
    });
  }

  return next(req);
};
