import { catchSpecificHttpStatusError } from '../core/rxjs-pipes';
import { isProjectConnectionError, ProjectConnectionError } from './models/project-connection-error.model';
import { Observable, throwError } from 'rxjs';

type ProjectConnectionErrorSelector<T, O> = (err: ProjectConnectionError, caught: Observable<T>) => Observable<O>;

export const catchProjectConnectionError = <T, O>(selector: ProjectConnectionErrorSelector<T, O>) =>
  catchSpecificHttpStatusError<T, O>(409, (err, caught) =>
    isProjectConnectionError(err.error)
      ? selector(err.error, caught)
      : throwError(() => err)
  );

export const unwrapProjectConnectionError = <T>() =>
  catchProjectConnectionError<T, T>(err => throwError(() => err));
