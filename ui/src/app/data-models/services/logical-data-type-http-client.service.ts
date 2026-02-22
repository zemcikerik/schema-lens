import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { LogicalDataType } from '../models/logical-model.model';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';

@Injectable({
  providedIn: 'root',
})
export class LogicalDataTypeHttpClientService {
  // TODO: implement requests
  private httpClient = inject(HttpClient);

  createDataType(dataModelId: number, dataType: LogicalDataType): Observable<LogicalDataType> {
    //return this.httpClient.post<LogicalDataType>(`/model/${dataModelId}/dataType`, dataType);
    return of({ typeId: 0, name: dataType.name }).pipe(delay(1500));
  }

  updateDataType(dataModelId: number, dataType: LogicalDataType): Observable<LogicalDataType> {
    //return this.httpClient.put<LogicalDataType>(`/model/${dataModelId}/dataType`, dataType);
    return of({ typeId: dataType.typeId, name: dataType.name }).pipe(delay(1500));
  }

  deleteDataType(dataModelId: number, typeId: number): Observable<boolean> {
    //return this.httpClient.delete(`/model/${dataModelId}/dataType/${typeId}`);
    return of(true).pipe(
      delay(1500),
      catchSpecificHttpStatusError(409, () => of(false)),
    );
  }
}


