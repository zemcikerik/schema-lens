import { inject, Injectable, Signal, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectHttpClientService } from './project-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private _projects = signal<Project[]>([]);
  private projectHttpClient = inject(ProjectHttpClientService);

  get projects(): Signal<Project[]> {
    return this._projects.asReadonly();
  }

  loadProjects(): Observable<unknown> {
    return this.projectHttpClient.getProjects().pipe(
      tap(projects => this._projects.set(projects)),
    );
  }

}
