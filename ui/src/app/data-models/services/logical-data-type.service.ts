import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogicalDataType } from '../models/logical-model.model';
import { LogicalDataTypeHttpClientService } from './logical-data-type-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class LogicalDataTypeService {
  private httpClient = inject(LogicalDataTypeHttpClientService);

  createDataType(dataModelId: number, dataType: LogicalDataType): Observable<LogicalDataType> {
    return this.httpClient.createDataType(dataModelId, dataType);
  }

  updateDataType(dataModelId: number, dataType: LogicalDataType): Observable<LogicalDataType> {
    return this.httpClient.updateDataType(dataModelId, dataType);
  }

  deleteDataType(dataModelId: number, typeId: number): Observable<unknown> {
    return this.httpClient.deleteDataType(dataModelId, typeId);
  }
}
