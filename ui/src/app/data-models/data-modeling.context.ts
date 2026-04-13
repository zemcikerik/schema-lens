import { computed, inject, Injectable } from '@angular/core';
import { RouteDataService } from '../core/routing/route-data.service';
import { RouteData } from '../core/models/route-data.model';

export type DataModelingLayer = 'logical' | 'physical' | 'unknown';

@Injectable({ providedIn: 'root' })
export class DataModelingContext {
  private routeData = inject(RouteDataService).routeData;

  layer = computed<DataModelingLayer>(() => {
    const data = this.routeData() as RouteData & { dataModelingLayer?: DataModelingLayer };
    return data.dataModelingLayer ?? 'unknown';
  });
}
