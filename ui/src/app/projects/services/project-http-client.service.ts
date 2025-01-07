import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectProperties } from '../models/project-properties.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectHttpClientService {

  private httpClient = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>('/project').pipe(
      map(projects => projects.map(project => ({ ...project, dbType: 'oracle' as const }))),
    );
  }

  getProjectProperties(projectId: string): Observable<ProjectProperties> {
    return this.httpClient.get<ProjectProperties>(`/project/${projectId}`).pipe(
      map(project => ({ ...project, dbType: 'oracle' })),
    );
  }

  createProject(properties: ProjectProperties): Observable<ProjectProperties> {
    return this.httpClient.post<ProjectProperties>(`/project`, properties).pipe(
      map(project => ({ ...project, dbType: 'oracle' })),
    );
  }

  updateProject(projectId: string, properties: ProjectProperties): Observable<ProjectProperties> {
    return this.httpClient.put<ProjectProperties>(`/project/${projectId}`, properties).pipe(
      map(project => ({ ...project, dbType: 'oracle' })),
    );
  }

  deleteProject(projectId: string): Observable<void> {
    return this.httpClient.delete<void>(`/project/${projectId}`);
  }

}
