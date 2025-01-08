import { ProjectCollaborationRole } from '../../models/project-collaboration-role.model';

const ALL_ROLES: ProjectCollaborationRole[] = [
  ProjectCollaborationRole.MANAGER,
  ProjectCollaborationRole.ADMIN,
  ProjectCollaborationRole.CONTRIBUTOR,
  ProjectCollaborationRole.VIEWER,
];

export interface RoleEntry {
  role: ProjectCollaborationRole;
  disabled: boolean;
}

export const getApplicableContributorRoles = (allowManagerRole: boolean): RoleEntry[] => ALL_ROLES.map(role => (
  { role, disabled: role === ProjectCollaborationRole.MANAGER && !allowManagerRole }
));
