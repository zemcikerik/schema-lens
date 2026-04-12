import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModelDataType } from '../models/data-model-data-type.model';
import { DataModelDataTypeHttpClientService } from './data-model-data-type-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DataModelDataTypeService {
  private httpClient = inject(DataModelDataTypeHttpClientService);

  createDataType(dataModelId: number, dataType: DataModelDataType): Observable<DataModelDataType> {
    return this.httpClient.createDataType(dataModelId, dataType);
  }

  updateDataType(dataModelId: number, dataType: DataModelDataType): Observable<DataModelDataType> {
    return this.httpClient.updateDataType(dataModelId, dataType);
  }

  deleteDataType(dataModelId: number, typeId: number): Observable<unknown> {
    return this.httpClient.deleteDataType(dataModelId, typeId);
  }
}
