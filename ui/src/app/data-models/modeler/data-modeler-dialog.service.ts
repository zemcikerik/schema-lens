import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { DialogService } from '../../core/dialog.service';
import {
  DataModelerAddExistingNodeDialogComponent,
  DataModelerAddExistingNodeDialogData,
} from './dialogs/data-modeler-add-existing-node-dialog/data-modeler-add-existing-node-dialog.component';
import { DataModelNode } from '../models/data-model-node.model';
import { DataModelDialogService } from '../services/data-model-dialog.service';

@Injectable()
export class DataModelerDialogService {
  private matDialog = inject(MatDialog);
  private dialogService = inject(DialogService);
  private dataModelDialogService = inject(DataModelDialogService);

  openAddExistingNode(nodes: DataModelNode[]): Observable<DataModelNode | null> {
    return this.matDialog
      .open(DataModelerAddExistingNodeDialogComponent, { data: { nodes } satisfies DataModelerAddExistingNodeDialogData })
      .afterClosed()
      .pipe(map((node: DataModelNode) => node ?? null));
  }

  openCreateNodeDialog(existingNames: string[]): Observable<string | null> {
    return this.dataModelDialogService.openCreateNodeDialog(existingNames);
  }

  openCreationErrorDialog(): void {
    this.dataModelDialogService.openCreationErrorDialog();
  }

  openDeleteNodeConfirmation(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'Delete Node',
      'Are you sure you want to delete this node? This will remove it from the data model.',
      'danger',
    );
  }

  openDeleteDiagramConfirmation(): Observable<boolean | null> {
    return this.dialogService.openConfirmationDialog(
      'Delete Diagram',
      'Are you sure you want to delete this diagram?',
      'danger',
    );
  }
}
