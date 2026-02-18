import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogicalDataModel } from '../models/logical-model.model';
import { DataModelHttpClientService } from './logical-data-model-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class LogicalDataModelService {
  private logicalDataModelHttpClient = inject(DataModelHttpClientService);

  getLogicalDataModel = (dataModelId: number): Observable<LogicalDataModel> =>
    this.logicalDataModelHttpClient.getLogical(dataModelId);
}
