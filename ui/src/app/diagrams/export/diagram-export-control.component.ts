import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DiagramHostComponent } from '../diagram-host.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DiagramExportDialogComponent, DiagramExportDialogData } from './diagram-export-dialog.component';
import { TranslatePipe } from '../../core/translate/translate.pipe';

@Component({
  selector: 'app-diagram-export-control',
  template: `
    <div class="diagram-export">
      <button mat-icon-button [matTooltip]="('DIAGRAM.EXPORT.LABEL' | translate)()" (click)="export()">
        <mat-icon>image</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslatePipe,
  ],
})
export class DiagramExportControlComponent {
  diagramHost = input.required<DiagramHostComponent>();
  additionalClasses = input<string[]>([]);
  private matDialog = inject(MatDialog);

  export(): void {
    const diagramRoot = this.diagramHost().getDiagramRoot();
    const data: DiagramExportDialogData = { diagramRoot, additionalClasses: this.additionalClasses() };
    this.matDialog.open(DiagramExportDialogComponent, { data });
  }
}
