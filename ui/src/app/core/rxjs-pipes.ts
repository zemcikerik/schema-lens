import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type HttpErrorSelector<T, O> = (err: HttpErrorResponse, caught: Observable<T>) => Observable<O>;

export const catchSpecificHttpStatusError = <T, O>(status: number, selector: HttpErrorSelector<T, O>) =>
  catchError((err: unknown, caught: Observable<T>) => err instanceof HttpErrorResponse && err.status === status
    ? selector(err, caught)
    : throwError(() => err)
  );
