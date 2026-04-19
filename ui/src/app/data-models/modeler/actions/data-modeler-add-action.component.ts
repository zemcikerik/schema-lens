import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { DataModelerState } from '../data-modeler-state.service';

@Component({
  selector: 'app-data-modeler-add-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      matTooltip="Add Node"
      [matMenuTriggerFor]="addMenu"
    >
      <mat-icon>add_box</mat-icon>
    </button>

    <mat-menu #addMenu>
      <button mat-menu-item (click)="state.createNode()">
        <mat-icon>add_circle</mat-icon> Create New Node
      </button>
      <button mat-menu-item (click)="state.addExistingNode()">
        <mat-icon>folder_open</mat-icon> Add Existing Node
      </button>
    </mat-menu>
  `,
  imports: [MatIconButton, MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, MatTooltip],
})
export class DataModelerAddActionComponent {
  state = inject(DataModelerState);
}
