import { lastValueFrom, of, throwError } from 'rxjs';
import { catchSpecificHttpStatusError } from './rxjs-pipes';
import { HttpErrorResponse } from '@angular/common/http';

describe('catchSpecificHttpStatusError', () => {
  it('should catch specified error', async () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });
    const observable$ = throwError(() => error).pipe(
      catchSpecificHttpStatusError(500, () => of('caught'))
    );
    await expect(lastValueFrom(observable$)).resolves.toEqual('caught');
  });

  it('should ignore error with different status', async () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error'
    });
    const observable$ = throwError(() => error).pipe(
      catchSpecificHttpStatusError(404, () => of('caught'))
    );
    await expect(lastValueFrom(observable$)).rejects.toEqual(error);
  });

  it('should ignore non-http errors', async () => {
    const error = new Error('Other error');
    const observable$ = throwError(() => error).pipe(
      catchSpecificHttpStatusError(500, () => of('caught'))
    );
    await expect(lastValueFrom(observable$)).rejects.toEqual(error);
  });
});
