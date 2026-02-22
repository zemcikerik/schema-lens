import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogicalDataModel } from '../models/logical-model.model';
import { LogicalDataModelHttpClientService } from './logical-data-model-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class LogicalDataModelService {
  private httpClient = inject(LogicalDataModelHttpClientService);

  getLogicalDataModel(dataModelId: number): Observable<LogicalDataModel | null> {
    return this.httpClient.getLogicalDataModel(dataModelId);
  }
}
