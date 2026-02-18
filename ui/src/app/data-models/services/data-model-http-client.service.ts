import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { DataModel } from '../models/data-model.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelHttpClientService {
  // TODO: implement requests
  private httpClient = inject(HttpClient);

  getDataModels(): Observable<DataModel[]> {
    //return this.httpClient.get<DataModel[]>('/models');
    return of([
      { id: 1, name: 'model1' },
      { id: 2, name: 'model2' },
    ]).pipe(delay(500));
  }

  getDataModel(dataModelId: number): Observable<DataModel> {
    //return this.httpClient.get<DataModel>('/model', dataModelId);
    return of(
      { id: dataModelId, name: 'model'+dataModelId },
    ).pipe(delay(200));
  }

  createDataModel(dataModel: DataModel): Observable<DataModel> {
    //return this.httpClient.post<DataModel>(`/model`, dataModelId);
    return of({ id: 0, name: dataModel.name }).pipe(delay(1500));
  }

  updateDataModel(updatedModel: DataModel): Observable<DataModel> {
    //return this.httpClient.put<DataModel>(`/model/${updatedModel.id}`, updatedModel);
    return of(updatedModel).pipe(delay(1500));
  }

  deleteDataModel(dataModelId: number): Observable<void> {
    //return this.httpClient.delete<void>(`/model/${dataModelId}`);
    return of().pipe(delay(1500));
  }
}
