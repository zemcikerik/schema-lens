import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangeLocaleDialogComponent } from '../change-locale-dialog/change-locale-dialog.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-change-locale-button',
  template: `
    <button type="button" mat-icon-button [matTooltip]="('LOCALE.LANGUAGE_BUTTON' | translate)()" (click)="changeLocale()">
      <mat-icon>language</mat-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    MatTooltip,
    TranslatePipe,
  ],
})
export class ChangeLocaleButtonComponent {

  private matDialog = inject(MatDialog);

  changeLocale(): void {
    this.matDialog.open(ChangeLocaleDialogComponent);
  }

}
