import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminBackup, AdminBackupConfiguration, AdminBackupRun } from '../models/admin-backup.model';

@Injectable({
  providedIn: 'root',
})
export class AdminBackupHttpClientService {
  private httpClient = inject(HttpClient);

  getBackup(): Observable<AdminBackup> {
    return this.httpClient.get<AdminBackup>('/admin/backup');
  }

  updateConfiguration(configuration: AdminBackupConfiguration): Observable<AdminBackupConfiguration> {
    return this.httpClient.put<AdminBackupConfiguration>('/admin/backup/configuration', configuration);
  }

  runBackup(): Observable<AdminBackupRun> {
    return this.httpClient.post<AdminBackupRun>('/admin/backup/run', {});
  }

  getRuns(): Observable<AdminBackupRun[]> {
    return this.httpClient.get<AdminBackupRun[]>('/admin/backup/runs');
  }

  downloadRun(id: number): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(`/admin/backup/runs/${id}/download`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  downloadRunLog(id: number): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(`/admin/backup/runs/${id}/log/download`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  deleteRun(id: number): Observable<unknown> {
    return this.httpClient.delete(`/admin/backup/runs/${id}`);
  }
}
