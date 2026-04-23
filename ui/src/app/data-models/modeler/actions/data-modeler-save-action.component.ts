import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataModelerDiagramState } from '../data-modeler-diagram.state';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-modeler-save-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [disabled]="loading() || !hasUnsavedPositions()"
      [matTooltip]="('GENERIC.SAVE_LABEL' | translate)()"
      (click)="save.emit()"
    >
      <mat-icon>save</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon, MatTooltip, TranslatePipe],
})
export class DataModelerSaveActionComponent {
  loading = inject(DataModelerDiagramState).loading;
  hasUnsavedPositions = input.required<boolean>();
  save = output();
}
