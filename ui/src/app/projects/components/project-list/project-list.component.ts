import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { MatButton } from '@angular/material/button';
import { ProjectListTableComponent } from '../project-list-table/project-list-table.component';
import { Project } from '../../models/project.model';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, finalize, of } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentCardComponent,
    ProjectListTableComponent,
    MatButton,
    MatProgressSpinner,
    AlertComponent,
    TranslatePipe
  ],
})
export class ProjectListComponent {

  private router = inject(Router);

  loading = signal<boolean>(true);
  projects = signal<Project[]>([]);

  constructor() {
    of([
      { id: 'f6b987b3-4c3b-4993-a9e1-10bbf6fb9ea5', name: 'First Project', dbType: 'oracle' as const },
      { id: 'f6b987b3-4c3b-4993-a9e1-10bbf6fb9ea6', name: 'Second Project', dbType: 'oracle' as const },
      { id: 'f6b987b3-4c3b-4993-a9e1-10bbf6fb9ea7', name: 'Third Project', dbType: 'oracle' as const },
      { id: 'f6b987b3-4c3b-4993-a9e1-10bbf6fb9ea8', name: 'Fourth Project', dbType: 'oracle' as const },
    ]).pipe(
      delay(1500),
      takeUntilDestroyed(),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: projects => this.projects.set(projects),
      error: () => void 0, // todo
    });
  }

  async openProject(project: Project): Promise<void> {
    await this.router.navigate(['/project', project.id]);
  }
}
