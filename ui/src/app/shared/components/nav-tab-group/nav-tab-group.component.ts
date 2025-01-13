import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal, Signal } from '@angular/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface NavTab {
  title: string;
  translateTitle: boolean;
  path: string;
}

interface NavTabEntry {
  title: string;
  translateTitle: boolean;
  routerLink: string[];
  url: string;
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
    TranslatePipe,
  ],
})
export class NavTabGroupComponent {
  baseRouterLink = input.required<string[]>();
  tabs = input.required<NavTab[]>();

  tabEntries: Signal<NavTabEntry[]> = computed(() => {
    const baseRouterLink = this.baseRouterLink();
    const tabs = this.tabs();

    return tabs.map(tab => {
      const routerLink = [...baseRouterLink, tab.path];
      return ({ ...tab, routerLink, url: routerLink.join('/') });
    });
  });

  private router = inject(Router);
  currentUrl = signal<string>(this.router.url);

  constructor() {
    // workaround for RouterLinkActive not updating active status of tab when RouterLink changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(),
    ).subscribe(event => this.currentUrl.set(event.urlAfterRedirects));
  }
}
