import { Route } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { hasAdminRoleGuard } from './core/guards/has-role.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'project', pathMatch: 'full' },
  { path: '404', loadComponent: () => import('./error-404.component').then(c => c.Error404Component) },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login.component').then(c => c.LoginComponent),
    data: { disableTopBar: true },
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/register.component').then(c => c.RegisterComponent),
    data: { disableTopBar: true },
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/components/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'project',
    loadComponent: () => import('./projects/components/project-list/project-list.component').then(c => c.ProjectListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'project/create',
    loadComponent: () => import('./projects/components/project-create/project-create.component').then(c => c.ProjectCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: 'project/:projectId',
    loadComponent: () => import('./projects/components/project/project.component').then(c => c.ProjectComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'properties', pathMatch: 'full' },
      {
        path: 'properties',
        loadComponent: () => import('./projects/components/project-properties-edit/project-properties-edit.component').then(c => c.ProjectPropertiesEditComponent),
      },
      {
        path: 'table/404',
        loadComponent: () => import('./tables/components/table-not-found/table-not-found.component').then(c => c.TableNotFoundComponent),
      },
      {
        path: 'table/:tableName',
        loadComponent: () => import('./tables/components/table/table.component').then(c => c.TableComponent),
        children: [
          { path: '', redirectTo: 'columns', pathMatch: 'full' },
          {
            path: 'columns',
            loadComponent: () => import('./tables/components/table-columns/table-columns.component').then(c => c.TableColumnsComponent),
          },
          {
            path: 'constraints',
            loadComponent: () => import('./tables/components/table-constraints/table-constraints.component').then(c => c.TableConstraintsComponent),
          },
        ],
      },
      {
        path: 'collaborators',
        loadComponent: () => import('./projects/components/project-collaborators/project-collaborators.component').then(c => c.ProjectCollaboratorsComponent),
      },
    ],
  },
  { path: 'help', redirectTo: 'help/faq' },
  {
    path: 'help/faq',
    loadComponent: () => import('./help/components/help-faq/help-faq.component').then(c => c.HelpFaqComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/components/admin/admin.component').then(c => c.AdminComponent),
    canActivate: [authGuard, hasAdminRoleGuard],
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      {
        path: 'user',
        loadComponent: () => import('./admin/components/admin-user-management/admin-user-management.component').then(c => c.AdminUserManagementComponent),
      },
      {
        path: 'faq',
        loadComponent: () => import('./admin/components/admin-faq/admin-faq.component').then(c => c.AdminFaqComponent),
      },
    ],
  },
  { path: '**', redirectTo: '404' },
];
