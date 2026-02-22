import { inject, Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { DialogService } from '../../../core/dialog.service';
import { LogicalAddExistingEntityDialogComponent, LogicalAddExistingEntityDialogData } from './dialogs/logical-add-existing-entity-dialog/logical-add-existing-entity-dialog.component';
import { LogicalEntity, LogicalEntitySummary } from '../../models/logical-model.model';
import { DataModelEntityCreateDialogComponent, DataModelEntityCreateDialogData } from '../../components/data-model-entity-create-dialog/data-model-entity-create-dialog.component';

@Injectable()
export class LogicalDataModelerDialogService {
  private matDialog = inject(MatDialog);
  private dialogService = inject(DialogService);
  private injector = inject(Injector);

  openAddExistingEntity(entities: LogicalEntity[]): Observable<LogicalEntity | null> {
    return this.matDialog
      .open(LogicalAddExistingEntityDialogComponent, { data: { entities } satisfies LogicalAddExistingEntityDialogData })
      .afterClosed()
      .pipe(map((entity: LogicalEntity) => (entity ? entity : null)));
  }

  openCreateEntity(entities: LogicalEntitySummary[]): Observable<LogicalEntity | null> {
    return this.matDialog
      .open(DataModelEntityCreateDialogComponent, { data: { entities } satisfies DataModelEntityCreateDialogData, injector: this.injector })
      .afterClosed()
      .pipe(map((entity: LogicalEntity) => (entity ? entity : null)));
  }

  openDeleteEntityConfirmation(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_ENTITY_CONFIRM_TITLE',
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_ENTITY_CONFIRM_DESCRIPTION',
      'danger',
    );
  }

  openDeleteRelationshipConfirmation(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_RELATIONSHIP_CONFIRM_TITLE',
      'DATA_MODELER.LOGICAL.DIALOGS.DELETE_RELATIONSHIP_CONFIRM_DESCRIPTION',
      'danger',
    );
  }
}
