import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { MatButton } from '@angular/material/button';
import { ProjectListTableComponent } from '../project-list-table/project-list-table.component';
import { Project } from '../../models/project.model';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatIcon } from '@angular/material/icon';

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
    TranslatePipe
  ],
})
export class ProjectListComponent {

  private router = inject(Router);

  projects = signal<Project[]>([]);

  constructor() {
    this.projects.set([
      { id: 'f6b987b3-4c3b-4993-a9e1-10bbf6fb9ea5', name: 'First Project', dbType: 'oracle' as const },
      { id: 'f6b987b3-4c3b-4993-a9e1-10bbf6fb9ea6', name: 'Second Project', dbType: 'oracle' as const },
      { id: 'f6b987b3-4c3b-4993-a9e1-10bbf6fb9ea7', name: 'Third Project', dbType: 'oracle' as const },
      { id: 'f6b987b3-4c3b-4993-a9e1-10bbf6fb9ea8', name: 'Fourth Project', dbType: 'oracle' as const },
    ]);
  }

  async openProject(project: Project): Promise<void> {
    await this.router.navigate(['/project', project.id]);
  }
}
