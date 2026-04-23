import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataModelNode } from '../../../models/data-model-node.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatListItem, MatNavList } from '@angular/material/list';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';

export interface DataModelerAddExistingNodeDialogData {
  nodes: DataModelNode[];
}

@Component({
  selector: 'app-data-modeler-add-existing-node-dialog',
  template: `
    <h2 mat-dialog-title>{{ ('DATA_MODEL.MODELER.DIALOGS.ADD_EXISTING_NODE.TITLE' | translate)() }}</h2>

    <mat-dialog-content>
      @if (data.nodes.length === 0) {
        <app-alert>{{ ('DATA_MODEL.MODELER.DIALOGS.ADD_EXISTING_NODE.EMPTY_LABEL' | translate)() }}</app-alert>
      } @else {
        <mat-nav-list>
          @for (node of data.nodes; track node.nodeId) {
            <mat-list-item (click)="select(node)">{{ node.name }}</mat-list-item>
          }
        </mat-nav-list>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">{{ ('GENERIC.CANCEL_LABEL' | translate)() }}</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatNavList,
    MatListItem,
    AlertComponent,
    TranslatePipe,
  ],
})
export class DataModelerAddExistingNodeDialogComponent {
  private matDialogRef = inject(MatDialogRef<DataModelerAddExistingNodeDialogComponent, DataModelNode>);
  data = inject<DataModelerAddExistingNodeDialogData>(MAT_DIALOG_DATA);

  select(node: DataModelNode): void {
    this.matDialogRef.close(node);
  }

  cancel(): void {
    this.matDialogRef.close();
  }
}
