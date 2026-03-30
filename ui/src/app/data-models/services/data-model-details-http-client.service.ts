import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchSpecificHttpStatusError } from '../../core/rxjs-pipes';
import { DataModelDetails } from '../models/data-model-types.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelDetailsHttpClientService {
  private httpClient = inject(HttpClient);

  getDataModelDetails(dataModelId: number): Observable<DataModelDetails | null> {
    return this.httpClient.get<DataModelDetails>(`/model/${dataModelId}`).pipe(
      catchSpecificHttpStatusError(404, () => of(null)),
    );
  }
}
