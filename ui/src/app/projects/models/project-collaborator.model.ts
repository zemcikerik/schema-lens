import { ProjectCollaborationRole } from './project-collaboration-role.model';

export interface ProjectCollaborator {
  username: string;
  email: string;
  role: ProjectCollaborationRole;
}
