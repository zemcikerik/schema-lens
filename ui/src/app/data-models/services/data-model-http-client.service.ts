import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataModel } from '../models/data-model.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelHttpClientService {
  private httpClient = inject(HttpClient);

  getDataModels(): Observable<DataModel[]> {
    return this.httpClient.get<DataModel[]>('/model');
  }

  createDataModel(dataModel: DataModel): Observable<DataModel> {
    return this.httpClient.post<DataModel>('/model', { name: dataModel.name });
  }

  updateDataModel(updatedModel: DataModel): Observable<DataModel> {
    return this.httpClient.put<DataModel>(`/model/${updatedModel.id}`, { name: updatedModel.name });
  }

  deleteDataModel(dataModelId: number): Observable<unknown> {
    return this.httpClient.delete(`/model/${dataModelId}`);
  }
}
