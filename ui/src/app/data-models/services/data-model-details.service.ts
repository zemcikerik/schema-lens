import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelDetails } from '../models/data-model-types.model';
import { DataModelDetailsHttpClientService } from './data-model-details-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DataModelDetailsService {
  private httpClient = inject(DataModelDetailsHttpClientService);

  getDataModelDetails(dataModelId: number): Observable<DataModelDetails | null> {
    return this.httpClient.getDataModelDetails(dataModelId);
  }
}
