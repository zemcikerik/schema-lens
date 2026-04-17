import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-save-delete-control',
  template: `
    <div class="save-delete-control">
      @if (deleteVisible()) {
        <button matButton="filled" class="save-delete-control__delete" [disabled]="deleteDisabled()" (click)="delete.emit()">
          <mat-icon>delete</mat-icon>
          @if (deleteLoading()) {
            <app-progress-spinner [center]="true" size="small" />
          } @else {
            {{ ('GENERIC.DELETE_LABEL' | translate)() }}
          }
        </button>
      }

      @if (saveVisible()) {
        <button matButton="filled" (click)="save.emit()" [disabled]="saveDisabled()">
          <mat-icon>save</mat-icon>
          @if (saveLoading()) {
            <app-progress-spinner [center]="true" size="small" />
          } @else {
            {{ ('GENERIC.SAVE_LABEL' | translate)() }}
          }
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, ProgressSpinnerComponent, TranslatePipe],
})
export class SaveDeleteControlComponent {
  saveVisible = input<boolean>(true);
  saveLoading = input<boolean>(false);
  saveDisabled = input<boolean>(false);
  save = output<void>();

  deleteVisible = input<boolean>(true);
  deleteLoading = input<boolean>(false);
  deleteDisabled = input<boolean>(false);
  delete = output<void>();
}
