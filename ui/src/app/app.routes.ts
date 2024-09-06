import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'project/:projectName',
    loadComponent: () => null as any,
    children: [
      { path: 'table/:tableName', loadComponent: () => null as any },
    ],
  },
];
