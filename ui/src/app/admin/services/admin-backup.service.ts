import { inject, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DownloadService } from '../../core/services/download.service';
import { AdminBackup, AdminBackupConfiguration, AdminBackupRun } from '../models/admin-backup.model';
import { AdminBackupHttpClientService } from './admin-backup-http-client.service';

@Injectable({ providedIn: 'root' })
export class AdminBackupService {
  private adminBackupHttpClient = inject(AdminBackupHttpClientService);
  private downloadService = inject(DownloadService);

  getBackup(): Observable<AdminBackup> {
    return this.adminBackupHttpClient.getBackup();
  }

  updateConfiguration(configuration: AdminBackupConfiguration): Observable<AdminBackupConfiguration> {
    return this.adminBackupHttpClient.updateConfiguration(configuration);
  }

  runBackup(): Observable<AdminBackupRun> {
    return this.adminBackupHttpClient.runBackup();
  }

  getRuns(): Observable<AdminBackupRun[]> {
    return this.adminBackupHttpClient.getRuns();
  }

  downloadRun(run: AdminBackupRun): Observable<unknown> {
    return this.adminBackupHttpClient.downloadRun(run.id).pipe(
      tap(response => this.downloadResponse(response, run.fileName ?? `backup-run-${run.id}.dmp`)),
    );
  }

  downloadRunLog(run: AdminBackupRun): Observable<unknown> {
    return this.adminBackupHttpClient.downloadRunLog(run.id).pipe(
      tap(response => this.downloadResponse(response, run.logFileName)),
    );
  }

  deleteRun(id: number): Observable<unknown> {
    return this.adminBackupHttpClient.deleteRun(id);
  }

  private downloadResponse(response: HttpResponse<Blob>, fallbackFileName: string): void {
    this.downloadService.downloadBlob(
      response.body ?? new Blob(),
      this.fileNameFromContentDisposition(response) ?? fallbackFileName,
    );
  }

  private fileNameFromContentDisposition(response: HttpResponse<Blob>): string | null {
    const contentDisposition = response.headers.get('content-disposition');
    const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/i);

    return fileNameMatch?.[1] ?? null;
  }
}
