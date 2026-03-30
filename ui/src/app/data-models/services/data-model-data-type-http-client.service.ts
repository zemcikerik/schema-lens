import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { DataModelDataType } from '../models/data-model-types.model';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';

@Injectable({
  providedIn: 'root',
})
export class DataModelDataTypeHttpClientService {
  private httpClient = inject(HttpClient);

  createDataType(dataModelId: number, dataType: DataModelDataType): Observable<DataModelDataType> {
    return this.httpClient.post<DataModelDataType>(`/model/${dataModelId}/dataType`, { name: dataType.name });
  }

  updateDataType(dataModelId: number, dataType: DataModelDataType): Observable<DataModelDataType> {
    return this.httpClient.put<DataModelDataType>(`/model/${dataModelId}/dataType/${dataType.typeId}`, { name: dataType.name });
  }

  deleteDataType(dataModelId: number, typeId: number): Observable<unknown> {
    return this.httpClient.delete(`/model/${dataModelId}/dataType/${typeId}`).pipe(
      map(() => true),
      catchSpecificHttpStatusError(409, () => of(false)),
    );
  }
}
