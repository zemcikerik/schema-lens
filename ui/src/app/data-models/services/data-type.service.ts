import { inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { DataTypeHttpClientService } from './data-type-http-client.service';
import { DataType } from '../models/logical-model.model';

export enum ChangedReason {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface TypeChangedArgs {
  reason: ChangedReason;
  type: DataType;
}

@Injectable({
  providedIn: 'root',
})
export class DataTypeService {
  typeChanged$ = new Subject<TypeChangedArgs>();

  private dataTypeHttpClient = inject(DataTypeHttpClientService);

  createDataType(dataModelId: number, dataType: DataType): Observable<DataType> {
    return this.dataTypeHttpClient
      .createDataType(dataModelId, dataType)
      .pipe(tap(t => this.typeChanged$.next({ reason: ChangedReason.CREATE, type: t })));
  }

  updateDataType(dataModelId: number, dataType: DataType): Observable<DataType> {
    return this.dataTypeHttpClient
      .updateDataType(dataModelId, dataType)
      .pipe(tap(t => this.typeChanged$.next({ reason: ChangedReason.UPDATE, type: t })));
  }

  deleteDataType(dataModelId: number, dataType: DataType): Observable<boolean> {
    return this.dataTypeHttpClient
      .deleteDataType(dataModelId, dataType)
      .pipe(tap(() => this.typeChanged$.next({ reason: ChangedReason.DELETE, type: dataType })));
  }
}
