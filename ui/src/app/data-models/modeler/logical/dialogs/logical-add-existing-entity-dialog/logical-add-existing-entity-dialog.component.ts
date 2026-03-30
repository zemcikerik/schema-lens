import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataModelNode } from '../../../../models/data-model-types.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../../../core/translate/translate.pipe';
import { MatNavList, MatListItem } from '@angular/material/list';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';

export interface LogicalAddExistingEntityDialogData {
  entities: DataModelNode[];
}

@Component({
  selector: 'app-logical-add-existing-entity-dialog',
  templateUrl: './logical-add-existing-entity-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    TranslatePipe,
    MatNavList,
    MatListItem,
    AlertComponent,
  ],
})
export class LogicalAddExistingEntityDialogComponent {
  private matDialogRef = inject(MatDialogRef<LogicalAddExistingEntityDialogComponent, DataModelNode>);
  data = inject<LogicalAddExistingEntityDialogData>(MAT_DIALOG_DATA);

  select(entity: DataModelNode): void {
    this.matDialogRef.close(entity);
  }

  cancel(): void {
    this.matDialogRef.close(null);
  }
}
