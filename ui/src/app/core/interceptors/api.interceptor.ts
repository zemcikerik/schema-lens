import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';

export const IS_API_REQUEST = new HttpContextToken<boolean | undefined>(() => undefined);

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.context.get(IS_API_REQUEST) ?? req.url.startsWith('/');

  if (isApiRequest) {
    req = req.clone({
      url: `/api${req.url}`
    });
  }

  return next(req);
};
