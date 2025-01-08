import { inject, Pipe, PipeTransform, Signal } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { ProjectCollaborationRole } from '../models/project-collaboration-role.model';

type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'CONTRIBUTOR' | 'VIEWER';

@Pipe({
  name: 'hasProjectRole',
  standalone: true,
  pure: true,
})
export class HasProjectRolePipe implements PipeTransform {

  private projectService = inject(ProjectService);

  transform(projectId: string, role: Role): Signal<boolean> {
    return this.projectService.hasProjectRole(projectId, ProjectCollaborationRole[role]);
  }

}
