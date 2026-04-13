import { ChangeDetectionStrategy, Component, input, output, viewChild } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatListItem } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';

export interface ObjectSelectorEntry {
  id: unknown;
  label: string;
  routerLink: (string | number)[];
}

@Component({
  selector: 'app-object-selector',
  templateUrl: './object-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelContent,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    SidebarCloseDirective,
    ProgressSpinnerComponent,
  ],
})
export class ObjectSelectorComponent {
  title = input.required<string>();
  entries = input<ObjectSelectorEntry[]>([]);
  loading = input(false);
  disabled = input(false);
  opened = output<void>();

  expansionPanel = viewChild.required(MatExpansionPanel);

  closePanel(): void {
    this.expansionPanel().close();
  }
}
