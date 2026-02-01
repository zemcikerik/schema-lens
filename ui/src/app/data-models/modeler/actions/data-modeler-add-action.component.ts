import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { DataModelerTranslatePipe } from '../data-modeler-translate.pipe';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-data-modeler-add-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      mat-icon-button
      [matTooltip]="('DATA_MODELER.$type.ACTION.ADD_NODE' | dataModelerTranslate)()"
      [matMenuTriggerFor]="addMenu"
    >
      <mat-icon>add_box</mat-icon>
    </button>
    
    <mat-menu #addMenu>
      <button mat-menu-item>
        <mat-icon>add_circle</mat-icon> {{ ('DATA_MODELER.$type.ACTION.CREATE_NODE' | dataModelerTranslate)() }}
      </button>
      <button mat-menu-item>
        <mat-icon>folder_open</mat-icon> {{ ('DATA_MODELER.$type.ACTION.EXISTING_NODE' | dataModelerTranslate)() }}
      </button>
    </mat-menu>
  `,
  imports: [
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    DataModelerTranslatePipe,
    MatTooltip,
  ],
})
export class DataModelerAddActionComponent {
}
