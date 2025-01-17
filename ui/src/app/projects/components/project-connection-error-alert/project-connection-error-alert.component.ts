import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ProjectConnectionError } from '../../models/project-connection-error.model';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-project-connection-error-alert',
  template: `
    <app-alert type="error">
      <div>{{ (errorLabelKey() | translate)() }}</div>
      
      @let message = error().message;
      @if (message) {
        <div>{{ ('PROJECTS.CONNECTION_ERROR.DETAILS_LABEL' | translate: { message })() }}</div>
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
  error = input.required<ProjectConnectionError>();
  errorLabelKey = computed(() => `PROJECTS.CONNECTION_ERROR.${this.error().type}`);
}
