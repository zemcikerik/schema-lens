import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DataModelerDiagramState } from '../data-modeler-diagram.state';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-modeler-focus-selection-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [disabled]="!selection()"
      [matTooltip]="('DATA_MODEL.MODELER.ACTIONS.FOCUS_SELECTION_TOOLTIP' | translate)()"
      (click)="focusSelection()"
    >
      <mat-icon>center_focus_strong</mat-icon>
    </button>
  `,
  imports: [MatIconButton, MatIcon, MatTooltip, TranslatePipe],
})
export class DataModelerFocusSelectionActionComponent {
  private state = inject(DataModelerDiagramState);
  selection = this.state.currentSelection;

  focusSelection(): void {
    const selection = this.selection();

    if (!selection) {
      return;
    }

    if (selection.type === 'node') {
      this.state.focusNode(selection.node.id);
    } else {
      this.state.focusEdge(selection.edge.id);
    }
  }
}
