import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ProjectObjectNavService } from '../../services/project-object-nav.service';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatDialog } from '@angular/material/dialog';
import {
  ProjectConnectionErrorDialogComponent
} from '../project-connection-error-dialog/project-connection-error-dialog.component';
import { ObjectSelectorComponent, ObjectSelectorEntry } from '../../../shared/components/object-selector/object-selector.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-project-object-nav-host',
  template: `
    @for (selector of selectors(); track selector.id) {
      <app-object-selector
        [title]="(selector.titleTranslationKey | translate)()"
        [loadEntries]="selector.loadAction"
        (displayError)="displayError($event)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, ObjectSelectorComponent],
})
export class ProjectObjectNavHostComponent {
  projectId = input.required<string>();

  private matDialog = inject(MatDialog);
  private projectObjectNavService = inject(ProjectObjectNavService);
  objectDefinitions = computed(() => this.projectObjectNavService.getObjectDefinitionsFor(this.projectId()));

  selectors = computed(() =>
    this.objectDefinitions().map(definition => ({
      id: definition.id,
      titleTranslationKey: definition.titleTranslationKey,
      loadAction: () => definition.objectLoadAction().pipe(map(objects =>
        objects.map((object): ObjectSelectorEntry => ({
          id: object,
          label: object,
          routerLink: [...definition.baseRouterLink, object],
        }))
      )),
    })),
  );

  displayError(error: unknown): void {
    this.matDialog.open(ProjectConnectionErrorDialogComponent, { data: error });
  }
}
