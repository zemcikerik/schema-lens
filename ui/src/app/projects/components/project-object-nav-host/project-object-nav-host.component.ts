import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ProjectObjectNavService } from '../../services/project-object-nav.service';
import { ProjectObjectSelectorComponent } from '../project-object-selector/project-object-selector.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatDialog } from '@angular/material/dialog';
import {
  ProjectConnectionErrorDialogComponent
} from '../project-connection-error-dialog/project-connection-error-dialog.component';

@Component({
  selector: 'app-project-object-nav-host',
  template: `
    @for (objectDefinition of objectDefinitions(); track objectDefinition.id) {
      <app-project-object-selector
        [title]="(objectDefinition.titleTranslationKey | translate)()"
        [baseRouterLink]="objectDefinition.baseRouterLink"
        [loadAction]="objectDefinition.objectLoadAction"
        (displayError)="displayError($event)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProjectObjectSelectorComponent,
    TranslatePipe,
  ],
})
export class ProjectObjectNavHostComponent {
  projectId = input.required<string>();

  private matDialog = inject(MatDialog);
  private projectObjectNavService = inject(ProjectObjectNavService);
  objectDefinitions = computed(() => this.projectObjectNavService.getObjectDefinitionsFor(this.projectId()));

  displayError(error: unknown): void {
    this.matDialog.open(ProjectConnectionErrorDialogComponent, { data: error });
  }
}
