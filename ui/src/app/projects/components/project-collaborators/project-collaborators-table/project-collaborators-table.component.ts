import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ProjectCollaborator } from '../../../models/project-collaborator.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';
import { ProjectRoleTypeToLabelPipe } from '../../../pipes/project-role-type-to-label.pipe';
import { ProfilePictureComponent } from '../../../../shared/components/profile-picture/profile-picture.component';

@Component({
  selector: 'app-project-collaborators-table',
  templateUrl: './project-collaborators-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatMenuContent,
    TranslatePipe,
    ProjectRoleTypeToLabelPipe,
    ProfilePictureComponent,
  ],
})
export class ProjectCollaboratorsTableComponent {
  readonly COLUMNS = ['picture', 'username', 'email', 'role', 'actions'];

  collaborators = input.required<ProjectCollaborator[]>();
  showActions = input.required<boolean>();
  allowActionsForManagers = input.required<boolean>();
  changeRole = output<ProjectCollaborator>();
  remove = output<ProjectCollaborator>();

  displayedColumns = computed(() =>
    this.showActions()
      ? this.COLUMNS
      : this.COLUMNS.filter(c => c !== 'actions')
  );
}
