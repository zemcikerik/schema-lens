import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataModelerTranslatePipe } from '../data-modeler-translate.pipe';
import { DATA_MODELING_FACADE } from '../data-modeling.facade';

@Component({
  selector: 'app-data-modeler-save-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [disabled]="loading() || !hasUnsavedPositions()"
      [matTooltip]="('DATA_MODELER.GENERIC.ACTION.SAVE' | dataModelerTranslate)()"
      (click)="save.emit()"
    >
      <mat-icon>save</mat-icon>
    </button>
  `,
  imports: [
    MatIconButton,
    MatIcon,
    MatTooltip,
    DataModelerTranslatePipe,
  ],
})
export class DataModelerSaveActionComponent {
  loading = inject(DATA_MODELING_FACADE).loading;
  hasUnsavedPositions = input.required<boolean>();
  save = output();
}
