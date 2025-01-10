import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProjectObjectNavHostComponent } from '../project-object-nav-host/project-object-nav-host.component';
import { SidebarCloseDirective } from '../../../core/layouts/sidebar-close.directive';

@Component({
  selector: 'app-project-nav',
  templateUrl: './project-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatNavList,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    ProjectObjectNavHostComponent,
    SidebarCloseDirective,
  ],
})
export class ProjectNavComponent {
  projectId = input.required<string>();
}
