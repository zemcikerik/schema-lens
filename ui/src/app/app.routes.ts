import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'project', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login.component').then(c => c.LoginComponent),
    data: { disableTopBar: true },
  },
  {
    path: 'project',
    loadComponent: () => import('./projects/components/project-list/project-list.component').then(c => c.ProjectListComponent),
  },
  {
    path: 'project/create',
    loadComponent: () => import('./projects/components/project-create/project-create.component').then(c => c.ProjectCreateComponent),
  },
  {
    path: 'project/:projectId',
    loadComponent: () => import('./projects/components/project/project.component').then(c => c.ProjectComponent),
    children: [
      { path: '', redirectTo: 'properties', pathMatch: 'full' },
      {
        path: 'properties',
        loadComponent: () => import('./projects/components/project-properties-edit/project-properties-edit.component').then(c => c.ProjectPropertiesEditComponent),
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
    ],
  },
];
