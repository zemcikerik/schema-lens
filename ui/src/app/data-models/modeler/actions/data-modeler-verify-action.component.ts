import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-data-modeler-verify-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-icon-button matTooltip="Verify">
      <mat-icon>domain_verification</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon, MatTooltip],
})
export class DataModelerVerifyActionComponent {
}
