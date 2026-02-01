import { catchError, Observable, pairwise, startWith, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

type HttpErrorSelector<T, O> = (err: HttpErrorResponse, caught: Observable<T>) => Observable<O>;

export const catchSpecificHttpStatusError = <T, O>(status: number, selector: HttpErrorSelector<T, O>) =>
  catchError((err: unknown, caught: Observable<T>) => err instanceof HttpErrorResponse && err.status === status
    ? selector(err, caught)
    : throwError(() => err)
  );

export const combineWithPrevious = <T>(observable: Observable<T>): Observable<[T | undefined, T]> =>
  observable.pipe(
    startWith(undefined),
    pairwise(),
  ) as Observable<[T | undefined, T]>;
