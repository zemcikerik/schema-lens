import { Route } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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
          { path: '', redirectTo: 'properties', pathMatch: 'full' },
          {
            path: 'properties',
            loadComponent: () => import('./tables/components/table-properties/table-properties.component').then(c => c.TablePropertiesComponent),
          },
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
];
