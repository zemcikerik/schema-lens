import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelContent, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.component';

@Component({
  selector: 'app-object-selector',
  templateUrl: './object-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelContent,
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    ProgressSpinnerComponent,
  ],
})
export class ObjectSelectorComponent {
  title = input.required<string>();
  baseRouterLink = input.required<string[]>();
  objects = input.required<string[] | null>();
  loading = input.required<boolean>();
  reloadObjects = output();

  objectListEntries = computed(() => {
    const objects = this.objects();
    if (objects === null) {
      return;
    }
    const baseRouterLink = this.baseRouterLink();

    return objects.map(object => ({
      name: object,
      routerLink: [...baseRouterLink, object]
    }));
  });

  triggerObjectLoadIfNeeded(): void {
    if (!this.loading() && this.objects() === null) {
      this.reloadObjects.emit();
    }
  }
}
