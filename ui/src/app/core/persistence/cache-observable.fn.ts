import { defer, Observable, of, shareReplay } from 'rxjs';

type ObservableFn<T extends unknown[], R> = (...args: T) => Observable<R>;

export const cacheObservable = <T extends string[], R>(fn: ObservableFn<T, R>) => {
  const cache: Partial<Record<string, Observable<R>>> = {};

  const cachedFn = (...args: T): Observable<R> => {
    const cacheKey = createCacheKey(args);

    return defer(() => {
      if (cache[cacheKey]) {
        return cache[cacheKey];
      }

      const observable = fn(...args).pipe(shareReplay(1));
      cache[cacheKey] = observable;
      return observable;
    })
  };

  cachedFn.add = (result: R, ...args: T): void => {
    const cacheKey = createCacheKey(args);

    if (cacheKey in cache) {
      throw new Error('Item already present in cache!');
    }

    cache[cacheKey] = of(result);
  };

  cachedFn.invalidate = (...args: T): void => {
    delete cache[createCacheKey(args)];
  };

  return cachedFn;
};

const createCacheKey = (args: string[]): string => {
  return args.reduce((key: string, arg: string, index: number) =>
    index + 1 === args.length ? `${key}${arg}` : `${key}${arg}:`, ''
  );
};
