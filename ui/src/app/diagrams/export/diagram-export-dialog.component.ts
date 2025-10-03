import { ChangeDetectionStrategy, Component, inject, Injector, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../core/translate/translate.pipe';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, from, map, mergeMap } from 'rxjs';
import { ProgressSpinnerComponent } from '../../shared/components/progress-spinner/progress-spinner.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { DownloadService } from '../../core/services/download.service';
import { TranslateService } from '../../core/translate/translate.service';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { DiagramExportOptions } from './diagram-export.service';

export interface DiagramExportDialogData {
  diagramRoot: HTMLElement;
  additionalClasses: string[];
}

@Component({
  selector: 'app-diagram-export-dialog',
  templateUrl: './diagram-export-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatCheckbox,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    TranslatePipe,
    ProgressSpinnerComponent,
    AlertComponent,
    MatSlider,
    MatSliderThumb,
  ],
})
export class DiagramExportDialogComponent {
  readonly FORMATS = [
    { extension: 'png', mimeType: 'image/png' as const },
    { extension: 'jpeg', mimeType: 'image/jpeg' as const },
  ];

  optionsForm = new FormGroup({
    format: new FormControl(this.FORMATS[0], [Validators.required]),
    transparent: new FormControl(true),
    quality: new FormControl(0.8, [Validators.min(0.5), Validators.max(1)]),
  });

  state = signal<'options' | 'loading' | 'error' | 'success'>('options');
  private exportData = inject<DiagramExportDialogData>(MAT_DIALOG_DATA);

  private downloadService = inject(DownloadService);
  private injector = inject(Injector);
  private matDialogRef = inject(MatDialogRef);
  private translateService = inject(TranslateService);

  async export(): Promise<void> {
    const { diagramRoot, additionalClasses } = this.exportData;
    const { format, transparent: transparentValue, quality: qualityValue } = this.optionsForm.value;

    if (['loading', 'success'].includes(this.state()) || this.optionsForm.invalid || !format || !qualityValue) {
      return;
    }

    this.state.set('loading');
    this.matDialogRef.disableClose = true;

    from(import('./diagram-export.service')).pipe(
      map(m => this.injector.get(m.DiagramExportService)),
      mergeMap(exportService => {
        const transparent = !!(format.mimeType === 'image/png' && transparentValue);
        const quality = format.mimeType === 'image/jpeg' ? qualityValue : undefined;
        const options: DiagramExportOptions = { format: format.mimeType, transparent, quality, additionalClasses };
        return exportService.exportDiagram(diagramRoot, options);
      }),
      finalize(() => this.matDialogRef.disableClose = false),
    ).subscribe({
      next: blob => {
        const fileName = this.translateService.translate('DIAGRAM.EXPORT.FILE_NAME', { extension: format.extension })();
        this.downloadService.downloadBlob(blob, fileName);
        this.state.set('success');
      },
      error: (e: unknown) => {
        console.error(e);
        this.state.set('error');
      },
    });
  }

  formatPercentageLabel(value: number): string {
    return `${Math.round(value * 100)}%`;
  }
}
