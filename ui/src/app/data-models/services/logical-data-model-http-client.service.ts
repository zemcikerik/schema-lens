import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { LogicalDataModel } from '../models/logical-model.model';

@Injectable({
  providedIn: 'root',
})
export class DataModelHttpClientService {
  // TODO: implement requests
  private httpClient = inject(HttpClient);

  getLogical(dataModelId: number): Observable<LogicalDataModel> {
    //return this.httpClient.get<LogicalDataModel[]>(`/model/${dataModelId}/logical`);
    return of({
      dataTypes: [
        { typeId: 1, name: 'TEXT' },
        { typeId: 2, name: 'TEXT1' },
        { typeId: 3, name: 'TEXT2' },
        { typeId: 4, name: 'TEXT3' },
        { typeId: 5, name: 'TEXT4' },
      ],
      entities: [
        {
          entityId: 11,
          name: 'MY_ENTITY',
          attributes: [
            {
              attributeId: 123,
              name: 'NAME',
              typeId: 1,
              isPrimaryKey: false,
              isNullable: true,
              position: 1,
            },
            {
              attributeId: 124,
              name: 'NAME0',
              typeId: 1,
              isPrimaryKey: true,
              isNullable: false,
              position: 2,
            },
          ],
        },
      ],
      relationships: [
        {
          relationshipId: 21342134,
          fromEntityId: 11,
          toEntityId: 12,
          type: '1:1 | 1:N',
          isMandatory: true,
          isIdentifying: true,
          attributes: [{ referencedAttributeId: 12, name: 'ID_FK', position: 11 }],
        },
      ],
      diagrams: [
        {
          id: 100,
          name: 'diagram 1',
          type: 'logical',
          entities: null,
          relationships: null,
        },
        {
          id: 200,
          name: 'diagram 2',
          type: 'logical',
          entities: null,
          relationships: null,
        },
      ],
    }).pipe(delay(500));
  }
}
