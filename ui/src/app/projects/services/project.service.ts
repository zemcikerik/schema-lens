import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectHttpClientService } from './project-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectHttpClient = inject(ProjectHttpClientService);

  getProjects(): Observable<Project[]> {
    return this.projectHttpClient.getProjects();
  }

}
