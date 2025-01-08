import { DbType } from '../../core/models/db-type';
import { ProjectCollaborationRole } from './project-collaboration-role.model';

export interface Project {
  id: string;
  name: string;
  dbType: DbType;
  owner: string;
  currentUserRole: ProjectCollaborationRole;
}
