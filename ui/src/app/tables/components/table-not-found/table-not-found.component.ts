import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-table-not-found',
  template: `
    <app-alert type="error">
      {{ ('TABLES.NOT_FOUND_LABEL' | translate)() }}
    </app-alert>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AlertComponent,
    TranslatePipe,
  ],
})
export class TableNotFoundComponent {
}
