import { AfterViewInit, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { DiagramHostComponent } from './diagram-host.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../core/translate/translate.pipe';

@Component({
  selector: 'app-diagram-grid-control',
  template: `
    <div class="diagram-grid-control">
      <button mat-icon-button [matTooltip]="('DIAGRAM.GRID_TOGGLE_LABEL' | translate)()" (click)="toggle()">
        <mat-icon>{{ enabled() ? 'grid_on' : 'grid_off' }}</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatIconButton, MatTooltip, TranslatePipe],
})
export class DiagramGridControlComponent implements AfterViewInit {
  diagramHost = input.required<DiagramHostComponent>();
  enabled = signal<boolean>(false);

  // we need to get grid visibility state after the diagram is initialized
  ngAfterViewInit(): void {
    this.enabled.set(this.diagramHost().isGridVisible());
  }

  toggle(): void {
    this.enabled.update(enabled => {
      this.diagramHost().setGridVisibility(!enabled);
      return !enabled;
    });
  }
}
