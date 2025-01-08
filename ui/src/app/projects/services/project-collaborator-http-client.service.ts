import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ProjectCollaborator } from '../models/project-collaborator.model';
import { ProjectCollaborationRole } from '../models/project-collaboration-role.model';
import { catch404StatusError } from '../../core/rxjs-pipes';

@Injectable({
  providedIn: 'root',
})
export class ProjectCollaboratorHttpClientService {

  private httpClient = inject(HttpClient);

  getProjectCollaborators(projectId: string): Observable<ProjectCollaborator[]> {
    return this.httpClient.get<ProjectCollaborator[]>(`/project/${projectId}/collaborator`);
  }

  addProjectCollaborator(projectId: string, username: string, role: ProjectCollaborationRole): Observable<ProjectCollaborator | null> {
    const jsonRole = `"${role}"`;
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    });

    return this.httpClient.post<ProjectCollaborator>(`/project/${projectId}/collaborator/${username}`, jsonRole, { headers }).pipe(
      catch404StatusError(() => of(null)),
    );
  }

  updateProjectCollaborator(projectId: string, username: string, role: ProjectCollaborationRole): Observable<ProjectCollaborator> {
    const jsonRole = `"${role}"`;
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    });

    return this.httpClient.put<ProjectCollaborator>(`/project/${projectId}/collaborator/${username}`, jsonRole, { headers });
  }

  deleteProjectCollaborator(projectId: string, username: string): Observable<unknown> {
    return this.httpClient.delete(`/project/${projectId}/collaborator/${username}`);
  }

}
