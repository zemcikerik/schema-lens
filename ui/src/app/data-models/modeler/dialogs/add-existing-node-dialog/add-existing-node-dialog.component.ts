import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataModelNode } from '../../../models/data-model-node.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatListItem, MatNavList } from '@angular/material/list';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';

export interface AddExistingNodeDialogData {
  nodes: DataModelNode[];
}

// TODO: rename
@Component({
  selector: 'app-add-existing-node-dialog',
  template: `
    <h2 mat-dialog-title>Add Existing Node</h2>

    <mat-dialog-content>
      @if (data.nodes.length === 0) {
        <app-alert>No available nodes to add.</app-alert>
      } @else {
        <mat-nav-list>
          @for (node of data.nodes; track node.nodeId) {
            <mat-list-item (click)="select(node)">{{ node.name }}</mat-list-item>
          }
        </mat-nav-list>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
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
  ],
})
export class AddExistingNodeDialogComponent {
  private matDialogRef = inject(MatDialogRef<AddExistingNodeDialogComponent, DataModelNode>);
  data = inject<AddExistingNodeDialogData>(MAT_DIALOG_DATA);

  select(node: DataModelNode): void {
    this.matDialogRef.close(node);
  }

  cancel(): void {
    this.matDialogRef.close();
  }
}
