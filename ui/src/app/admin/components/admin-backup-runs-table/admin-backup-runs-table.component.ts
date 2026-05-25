import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProgressSpinnerComponent } from '../../../shared/components/progress-spinner/progress-spinner.component';
import { AdminBackupRun } from '../../models/admin-backup.model';

@Component({
  selector: 'app-admin-backup-runs-table',
  templateUrl: './admin-backup-runs-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconButton,
    MatIcon,
    MatMenuModule,
    MatTableModule,
    ProgressSpinnerComponent,
    TranslatePipe,
  ],
})
export class AdminBackupRunsTableComponent {
  readonly DISPLAYED_COLUMNS = ['id', 'startedAt', 'status', 'triggerType', 'fileName', 'fileSizeBytes', 'actions'];

  runs = input.required<AdminBackupRun[]>();
  downloadLoadingRunId = input<number | null>(null);
  download = output<AdminBackupRun>();
  downloadLog = output<AdminBackupRun>();
  delete = output<AdminBackupRun>();

  fileSizeLabel(run: AdminBackupRun): string {
    return run.fileSizeBytes !== null ? `${Math.max(run.fileSizeBytes / 1024 / 1024, 0.01).toFixed(2)} MB` : '-';
  }

  startedAtDate(run: AdminBackupRun): Date {
    return new Date(run.startedAt);
  }

  isDownloadLoading(run: AdminBackupRun): boolean {
    return this.downloadLoadingRunId() === run.id;
  }
}
