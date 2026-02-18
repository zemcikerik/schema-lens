import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { DataType } from '../models/logical-model.model';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';

@Injectable({
  providedIn: 'root',
})
export class DataTypeHttpClientService {
  // TODO: implement requests
  private httpClient = inject(HttpClient);

  createDataType(dataModelId: number, dataType: DataType): Observable<DataType> {
    //return this.httpClient.post<DataType>(`/model/${dataModelId}/dataType`, dataType);
    return of({ typeId: 0, name: dataType.name }).pipe(delay(1500));
  }

  updateDataType(dataModelId: number, dataType: DataType): Observable<DataType> {
    //return this.httpClient.put<DataType>(`/model/${dataModelId}/dataType`, dataType);
    return of({ typeId: dataType.typeId, name: dataType.name }).pipe(delay(1500));
  }

  deleteDataType(dataModelId: number, dataType: DataType): Observable<boolean> {
    //return this.httpClient.post<DataType>(`/model/${dataModelId}/dataType`, dataType);
    return of(true).pipe(
      delay(1500),
      catchSpecificHttpStatusError(409, () => of(false)),
    );
  }
}
