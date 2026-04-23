import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';

export interface DataModelerDeleteNodeDialogResult {
  deleteFromModel: boolean;
}

@Component({
  selector: 'app-data-modeler-delete-node-dialog',
  template: `
    <h2 mat-dialog-title>{{ ('DATA_MODEL.MODELER.DIALOGS.DELETE_NODE.TITLE' | translate)() }}</h2>

    <mat-dialog-content class="data-modeler__delete-node-form">
      <p>{{ ('DATA_MODEL.MODELER.DIALOGS.DELETE_NODE.DESCRIPTION' | translate)() }}</p>
      <mat-checkbox [(ngModel)]="deleteFromModel">
        {{ ('DATA_MODEL.MODELER.DIALOGS.DELETE_NODE.DELETE_FROM_MODEL_LABEL' | translate)() }}
      </mat-checkbox>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">{{ ('GENERIC.CANCEL_LABEL' | translate)() }}</button>
      <button mat-flat-button class="confirmation-dialog__button--danger" (click)="confirm()">
        {{ ('GENERIC.CONFIRM_LABEL' | translate)() }}
      </button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatCheckbox,
    FormsModule,
    TranslatePipe,
  ],
})
export class DataModelerDeleteNodeDialogComponent {
  private matDialogRef = inject(MatDialogRef<DataModelerDeleteNodeDialogComponent, DataModelerDeleteNodeDialogResult>);
  deleteFromModel = false;

  confirm(): void {
    this.matDialogRef.close({ deleteFromModel: this.deleteFromModel });
  }

  cancel(): void {
    this.matDialogRef.close();
  }
}
