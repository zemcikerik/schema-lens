import { inject, Injectable, Signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { DEFAULT_ROUTE_DATA, RouteData } from '../models/route-data.model';

@Injectable({
  providedIn: 'root',
})
export class RouteDataService {
  readonly routeData: Signal<RouteData>;

  constructor() {
    const route = inject(ActivatedRoute);

    const data$ = inject(Router).events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let data: RouteData = DEFAULT_ROUTE_DATA;
        let child: ActivatedRoute | null = route;

        while (child !== null) {
          data = { ...data, ...child.snapshot.data };
          child = child.firstChild;
        }

        return data;
      }),
    );

    this.routeData = toSignal(data$, { initialValue: DEFAULT_ROUTE_DATA });
  }
}
