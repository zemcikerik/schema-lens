import { Pipe, PipeTransform } from '@angular/core';
import { ProjectCollaborationRole } from '../models/project-collaboration-role.model';

@Pipe({
  name: 'projectRoleTypeToLabel',
  pure: true,
})
export class ProjectRoleTypeToLabelPipe implements PipeTransform {

  transform(role: ProjectCollaborationRole): string {
    return `PROJECTS.COLLABORATORS.ROLES.${role}_LABEL`;
  }

}
