import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ProjectObjectNavService } from '../../services/project-object-nav.service';
import { ObjectSelectorComponent } from '../../../shared/components/object-selector/object-selector.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-project-object-nav-host',
  template: `
    @for (objectDefinition of objectDefinitions(); track objectDefinition.id) {
      <app-object-selector
        [title]="(objectDefinition.titleTranslationKey | translate)()"
        [baseRouterLink]="objectDefinition.baseRouterLink"
        [loadAction]="objectDefinition.objectLoadAction" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ObjectSelectorComponent,
    TranslatePipe,
  ],
})
export class ProjectObjectNavHostComponent {
  projectId = input.required<string>();

  private projectObjectNavService = inject(ProjectObjectNavService);
  objectDefinitions = computed(() => this.projectObjectNavService.getObjectDefinitionsFor(this.projectId()));
}
