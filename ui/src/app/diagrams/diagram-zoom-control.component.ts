import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DiagramHostComponent } from './diagram-host.component';

const MIN_ZOOM_LEVEL = 0.2;
const MAX_ZOOM_LEVEL = 4;
const ZOOM_LEVEL_STEP = 0.2;

@Component({
  selector: 'app-diagram-zoom-control',
  templateUrl: './diagram-zoom-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatIconButton],
})
export class DiagramZoomControlComponent {
  diagramHost = input.required<DiagramHostComponent>();

  changeZoomLevel(direction: -1 | 1): void {
    const diagramHost = this.diagramHost();
    const newZoomLevel = diagramHost.getZoomLevel() + direction * ZOOM_LEVEL_STEP;
    diagramHost.setZoomLevel(this.clampZoomLevel(newZoomLevel));
  }

  private clampZoomLevel(zoomLevel: number): number {
    if (zoomLevel < MIN_ZOOM_LEVEL) {
      return MIN_ZOOM_LEVEL;
    }
    if (zoomLevel > MAX_ZOOM_LEVEL) {
      return MAX_ZOOM_LEVEL;
    }
    return zoomLevel;
  }
}
