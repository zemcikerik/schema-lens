import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { LogicalDataType } from '../models/logical-model.model';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';

@Injectable({
  providedIn: 'root',
})
export class LogicalDataTypeHttpClientService {
  private httpClient = inject(HttpClient);

  createDataType(dataModelId: number, dataType: LogicalDataType): Observable<LogicalDataType> {
    return this.httpClient.post<LogicalDataType>(`/model/${dataModelId}/dataType`, { name: dataType.name });
  }

  updateDataType(dataModelId: number, dataType: LogicalDataType): Observable<LogicalDataType> {
    return this.httpClient.put<LogicalDataType>(`/model/${dataModelId}/dataType/${dataType.typeId}`, { name: dataType.name });
  }

  deleteDataType(dataModelId: number, typeId: number): Observable<unknown> {
    return this.httpClient.delete(`/model/${dataModelId}/dataType/${typeId}`).pipe(
      map(() => true),
      catchSpecificHttpStatusError(409, () => of(false)),
    );
  }
}
