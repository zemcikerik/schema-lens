import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DataModel } from '../models/data-model.model';
import { DataModelHttpClientService } from './data-model-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class DataModelService {
  private _dataModels = signal<DataModel[]>([]);
  private dataModelHttpClient = inject(DataModelHttpClientService);
  readonly dataModels = this._dataModels.asReadonly();

  isDataModelAvailable(dataModelId: number): boolean {
    return this._dataModels().find(dataModel => dataModel.id === dataModelId) !== undefined;
  }

  loadDataModels(): Observable<DataModel[]> {
    return this.dataModelHttpClient.getDataModels().pipe(
      tap(dataModels => {
        this._dataModels.set(dataModels);
      }),
    );
  }

  getDataModel = (dataModelId: number) => this.dataModelHttpClient.getDataModel(dataModelId);

  createDataModel(dataModel: DataModel): Observable<DataModel> {
    return this.dataModelHttpClient
      .createDataModel(dataModel)
      .pipe(tap(model => this._dataModels.update(models => [...models, model])));
  }

  updateDataModel(dataModel: DataModel): Observable<DataModel> {
    return this.dataModelHttpClient.updateDataModel(dataModel).pipe(tap(model => this.updateExistingModels(model)));
  }

  deleteDataModel(dataModelId: number): Observable<void> {
    return this.dataModelHttpClient.deleteDataModel(dataModelId).pipe(tap(() => this.removeAvailableDataModel(dataModelId)));
  }

  private updateExistingModels(dataModel: DataModel): void {
    const modelIndex = this._dataModels().findIndex(model => model.id === dataModel.id);

    if (modelIndex === -1) {
      return;
    }

    this._dataModels.update(dataModels => {
      const dataModelsCopy = [...dataModels];
      dataModelsCopy[modelIndex] = dataModel;
      return dataModelsCopy;
    });
  }

  private removeAvailableDataModel(dataModelId: number): void {
    this._dataModels.update(dataModels => dataModels.filter(model => model.id !== dataModelId));
  }
}
