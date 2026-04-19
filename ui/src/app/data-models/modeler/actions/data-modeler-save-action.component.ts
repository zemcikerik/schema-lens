import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataModelerState } from '../data-modeler-state.service';

@Component({
  selector: 'app-data-modeler-save-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [disabled]="loading() || !hasUnsavedPositions()"
      matTooltip="Save"
      (click)="save.emit()"
    >
      <mat-icon>save</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon, MatTooltip],
})
export class DataModelerSaveActionComponent {
  loading = inject(DataModelerState).loading;
  hasUnsavedPositions = input.required<boolean>();
  save = output();
}
