import { inject, Injectable } from '@angular/core';
import { TableService } from '../../tables/services/table.service';
import { Observable } from 'rxjs';

export interface ProjectObjectDefinition {
  id: string;
  baseRouterLink: string[];
  titleTranslationKey: string;
  objectLoadAction: () => Observable<string[]>;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectObjectNavService {

  private tableService = inject(TableService);

  getObjectDefinitionsFor(projectId: string): ProjectObjectDefinition[] {
    return [
      {
        id: 'table',
        baseRouterLink: ['/project', projectId, 'table'],
        titleTranslationKey: 'TABLES.LIST_LABEL',
        objectLoadAction: () => this.tableService.getTableNames(projectId),
      },
    ];
  }

}
