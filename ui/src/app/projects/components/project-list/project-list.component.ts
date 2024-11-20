import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { MatButton } from '@angular/material/button';
import { ProjectListTableComponent } from '../project-list-table/project-list-table.component';
import { Project } from '../../models/project.model';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { IconEmphasisDirective } from '../../../shared/directives/icon-emphasis.directive';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentCardComponent,
    ProjectListTableComponent,
    MatIcon,
    MatButton,
    AlertComponent,
    TranslatePipe,
    IconEmphasisDirective,
  ],
})
export class ProjectListComponent {

  private router = inject(Router);

  projects = signal<Project[]>([]);

  constructor() {
    this.projects.set([
      { id: '86a06301-ae55-4d6a-9157-1cd1f994af65', name: 'First Project', dbType: 'oracle' as const },
    ]);
  }

  async openProject(project: Project): Promise<void> {
    await this.router.navigate(['/project', project.id]);
  }
}
