import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type HttpErrorSelector<T, O> = (err: HttpErrorResponse, caught: Observable<T>) => Observable<O>;

export const catchSpecificHttpStatusError = <T, O>(status: number, selector: HttpErrorSelector<T, O>) =>
  catchError((err: HttpErrorResponse, caught: Observable<T>) => err?.status === status
    ? selector(err, caught)
    : throwError(() => err)
  );

export const catch404StatusError = <T, O>(selector: HttpErrorSelector<T, O>) =>
  catchSpecificHttpStatusError<T, O>(404, selector);
