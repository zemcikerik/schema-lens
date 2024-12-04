import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { MatAnchor } from '@angular/material/button';
import { ProjectListTableComponent } from '../project-list-table/project-list-table.component';
import { Project } from '../../models/project.model';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { IconEmphasisDirective } from '../../../shared/directives/icon-emphasis.directive';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentCardComponent,
    ProjectListTableComponent,
    MatIcon,
    AlertComponent,
    TranslatePipe,
    IconEmphasisDirective,
    MatAnchor,
    RouterLink,
  ],
})
export class ProjectListComponent {
  projects = inject(ProjectService).projects;
  private router = inject(Router);

  async openProject(project: Project): Promise<void> {
    await this.router.navigate(['/project', project.id]);
  }
}
