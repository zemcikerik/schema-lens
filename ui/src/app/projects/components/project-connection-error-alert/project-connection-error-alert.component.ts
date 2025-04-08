import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { isProjectConnectionError } from '../../models/project-connection-error.model';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-project-connection-error-alert',
  template: `
    <app-alert type="error">
      @let connectionErr = connectionError();
      
      @if (connectionErr !== null) {
        <div>{{ (errorLabelKey() | translate)() }}</div>

        @if (connectionErr.message) {
          <div>{{ ('PROJECTS.CONNECTION_ERROR.DETAILS_LABEL' | translate: { message: connectionErr.message })() }}</div>
        }
      } @else {
        {{ ('GENERIC.ERROR_LABEL' | translate)() }}
      }
    </app-alert>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    TranslatePipe,
  ],
})
export class ProjectConnectionErrorAlertComponent {
  error = input.required<unknown>();

  connectionError = computed(() => {
    const error = this.error() as Record<string, unknown>;
    return isProjectConnectionError(error['error']) ? error['error'] : null;
  });

  errorLabelKey = computed(() => {
    const connectionError = this.connectionError();
    return connectionError ? `PROJECTS.CONNECTION_ERROR.${connectionError.type}` : '';
  });
}
