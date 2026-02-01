import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogService } from '../../../core/dialog.service';

@Injectable()
export class LogicalDataModelerDialogService {
  private matDialog = inject(MatDialog);
  private dialogService = inject(DialogService);

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
