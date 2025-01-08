import { inject, Injectable } from '@angular/core';
import { ProjectCollaboratorHttpClientService } from './project-collaborator-http-client.service';
import { Observable } from 'rxjs';
import { ProjectCollaborator } from '../models/project-collaborator.model';
import { ProjectCollaborationRole } from '../models/project-collaboration-role.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectCollaboratorService {

  private projectCollaboratorHttpClient = inject(ProjectCollaboratorHttpClientService);

  getProjectCollaborators(projectId: string): Observable<ProjectCollaborator[]> {
    return this.projectCollaboratorHttpClient.getProjectCollaborators(projectId);
  }

  addProjectCollaborator(projectId: string, username: string, role: ProjectCollaborationRole): Observable<ProjectCollaborator | null> {
    return this.projectCollaboratorHttpClient.addProjectCollaborator(projectId, username, role);
  }

  updateProjectCollaborator(projectId: string, username: string, role: ProjectCollaborationRole): Observable<ProjectCollaborator> {
    return this.projectCollaboratorHttpClient.updateProjectCollaborator(projectId, username, role);
  }

  deleteProjectCollaborator(projectId: string, username: string): Observable<unknown> {
    return this.projectCollaboratorHttpClient.deleteProjectCollaborator(projectId, username);
  }

}
