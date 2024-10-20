import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';

export interface NavTab {
  title: string;
  translateTitle: boolean;
  path: string;
}

interface NavTabEntry {
  title: string;
  translateTitle: boolean;
  routerLink: string[];
}

@Component({
  selector: 'app-nav-tab-group',
  templateUrl: './nav-tab-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
  ],
})
export class NavTabGroupComponent {
  baseRouterLink = input.required<string[]>();
  tabs = input.required<NavTab[]>();

  tabEntries: Signal<NavTabEntry[]> = computed(() => {
    const baseRouterLink = this.baseRouterLink();
    const tabs = this.tabs();
    return tabs.map(tab => ({ ...tab, routerLink: [...baseRouterLink, tab.path] }));
  });
}
