import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { TranslatePipe } from './core/translate/translate.pipe';
import { ProjectObjectListComponent } from './projects/components/project-object-list/project-object-list.component';

@Component({
  selector: 'app-layout-main',
  template: `
    <mat-toolbar class="top-bar">
      <span>{{ ('APP_TITLE' | translate)() }}</span>
      <div class="top-bar__separator"></div>
      <ng-content select="top-bar" />
    </mat-toolbar>

    <div class="app-content">
      <div style="width: 20em">
        <app-project-object-list />
      </div>
      <div style="flex-grow: 1; margin: 0 16px 16px 0; border-radius: 32px; background-color: white"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbar,
    TranslatePipe,
    ProjectObjectListComponent,
  ],
})
export class LayoutMainComponent {
}
