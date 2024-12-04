import { inject, Injectable, Signal, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectHttpClientService } from './project-http-client.service';
import { ProjectProperties } from '../models/project-properties.model';
import { cacheObservable } from '../../core/persistence/cache-observable.fn';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private _projects = signal<Project[]>([]);
  private projectHttpClient = inject(ProjectHttpClientService);

  get projects(): Signal<Project[]> {
    return this._projects.asReadonly();
  }

  isProjectAvailable(projectId: string): boolean {
    return this._projects().find(project => project.id === projectId) !== undefined;
  }

  loadProjects(): Observable<unknown> {
    return this.projectHttpClient.getProjects().pipe(
      tap(projects => this._projects.set(projects)),
    );
  }

  getProjectProperties = cacheObservable((projectId: string): Observable<ProjectProperties> => {
    return this.projectHttpClient.getProjectProperties(projectId);
  });

  createProject(properties: ProjectProperties): Observable<ProjectProperties> {
    return this.projectHttpClient.createProject(properties).pipe(
      tap(properties => this.addAvailableProject(properties.id!, properties)),
      tap(properties => this.addToPropertiesCache(properties.id!, properties)),
    );
  }

  updateProject(projectId: string, properties: ProjectProperties): Observable<ProjectProperties> {
    return this.projectHttpClient.updateProject(projectId, properties).pipe(
      tap(properties => this.updateExistingProjectWithProperties(projectId, properties)),
      tap(properties => {
        this.removeFromPropertiesCache(projectId);
        this.addToPropertiesCache(projectId, properties);
      }),
    );
  }

  deleteProject(projectId: string): Observable<void> {
    return this.projectHttpClient.deleteProject(projectId).pipe(
      tap(() => this.removeAvailableProject(projectId)),
      tap(() => this.removeFromPropertiesCache(projectId)),
    );
  }

  private addAvailableProject(projectId: string, properties: ProjectProperties): void {
    const project: Project = {
      id: projectId,
      name: properties.name,
      dbType: properties.dbType,
    };
    this._projects.update(projects => [...projects, project]);
  }

  private updateExistingProjectWithProperties(projectId: string, properties: ProjectProperties): void {
    const projectIndex = this._projects().findIndex(project => project.id === projectId);

    if (projectIndex === -1) {
      return;
    }

    this._projects.update(projects => {
      const projectsCopy = [...projects];
      projectsCopy[projectIndex] = { id: projectId, name: properties.name, dbType: properties.dbType };
      return projectsCopy;
    });
  }

  private removeAvailableProject(projectId: string): void {
    this._projects.update(projects => projects.filter(project => project.id !== projectId));
  }

  private addToPropertiesCache(projectId: string, properties: ProjectProperties): void {
    this.getProjectProperties.add(properties, projectId);
  }

  private removeFromPropertiesCache(projectId: string): void {
    this.getProjectProperties.invalidate(projectId);
  }
}
