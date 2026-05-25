import { ChangeDetectionStrategy, Component, DestroyRef, WritableSignal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { EMPTY, catchError, filter, finalize, mergeMap, switchMap, tap, timer } from 'rxjs';
import { DialogService } from '../../../core/dialog.service';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { IconEmphasisDirective } from '../../../shared/directives/icon-emphasis.directive';
import { AdminBackupConfiguration, AdminBackupRun } from '../../models/admin-backup.model';
import { AdminBackupService } from '../../services/admin-backup.service';
import {
  AdminBackupConfigurationFormComponent,
} from '../admin-backup-configuration-form/admin-backup-configuration-form.component';
import { AdminBackupRunsTableComponent } from '../admin-backup-runs-table/admin-backup-runs-table.component';

@Component({
  selector: 'app-admin-backup',
  templateUrl: './admin-backup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    AdminBackupRunsTableComponent,
    AdminBackupConfigurationFormComponent,
    IconEmphasisDirective,
    LayoutHeaderAndContentComponent,
    MatButton,
    MatIcon,
    ProgressSpinnerComponent,
    TranslatePipe,
  ],
})
export class AdminBackupComponent {
  private readonly BACKUP_RUNS_REFRESH_INTERVAL_MS = 10000;

  private adminBackupService = inject(AdminBackupService);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  backupLoadState = signal<'loading' | 'loaded' | 'failed'>('loading');
  runs = signal<AdminBackupRun[]>([]);
  backupRunInProgress = computed(() => this.runs().some(run => run.status === 'RUNNING'));

  configuration = signal<AdminBackupConfiguration | null>(null);
  configurationSaveInProgress = signal<boolean>(false);

  backupRunStartInProgress = signal<boolean>(false);
  downloadingRunId = signal<number | null>(null);
  backupOperationFailed = signal<boolean>(false);

  constructor() {
    this.adminBackupService.getBackup().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: backup => {
        this.configuration.set(backup.configuration);
        this.runs.set(backup.runs);
        this.backupLoadState.set('loaded');
      },
      error: () => this.backupLoadState.set('failed'),
    });

    this.startRunsRefresh();
  }

  private startRunsRefresh(): void {
    timer(this.BACKUP_RUNS_REFRESH_INTERVAL_MS, this.BACKUP_RUNS_REFRESH_INTERVAL_MS).pipe(
      switchMap(() => this.adminBackupService.getRuns().pipe(catchError(() => EMPTY))),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(runs => this.runs.set(runs));
  }

  submitConfiguration(configuration: AdminBackupConfiguration): void {
    this.beginOperation(this.configurationSaveInProgress);
    this.adminBackupService.updateConfiguration(configuration).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.configurationSaveInProgress.set(false)),
    ).subscribe({
      next: configuration => {
        this.configuration.set(configuration);
      },
      error: () => this.backupOperationFailed.set(true),
    });
  }

  runBackup(): void {
    if (this.backupRunInProgress()) {
      return;
    }

    this.beginOperation(this.backupRunStartInProgress);
    this.adminBackupService.runBackup().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.backupRunStartInProgress.set(false)),
    ).subscribe({
      next: run => {
        this.runs.update(runs => [run, ...runs.filter(r => r.id !== run.id)]);
      },
      error: () => this.backupOperationFailed.set(true),
    });
  }

  download(run: AdminBackupRun): void {
    this.beginDownloadOperation(run);
    this.adminBackupService.downloadRun(run).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.downloadingRunId.set(null)),
    ).subscribe({
      error: () => this.backupOperationFailed.set(true),
    });
  }

  downloadLog(run: AdminBackupRun): void {
    this.beginDownloadOperation(run);
    this.adminBackupService.downloadRunLog(run).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.downloadingRunId.set(null)),
    ).subscribe({
      error: () => this.backupOperationFailed.set(true),
    });
  }

  delete(run: AdminBackupRun): void {
    this.dialogService.openConfirmationDialog(
      'ADMIN.BACKUP.CONFIRM_DELETE_TITLE',
      'ADMIN.BACKUP.CONFIRM_DELETE_DESCRIPTION',
      'danger',
    ).pipe(
      filter(result => !!result),
      tap(() => this.backupOperationFailed.set(false)),
      mergeMap(() => this.adminBackupService.deleteRun(run.id)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.runs.update(runs => runs.filter(r => r.id !== run.id));
      },
      error: () => this.backupOperationFailed.set(true),
    });
  }

  private beginOperation(operationInProgress: WritableSignal<boolean>): void {
    operationInProgress.set(true);
    this.backupOperationFailed.set(false);
  }

  private beginDownloadOperation(run: AdminBackupRun): void {
    this.downloadingRunId.set(run.id);
    this.backupOperationFailed.set(false);
  }
}
