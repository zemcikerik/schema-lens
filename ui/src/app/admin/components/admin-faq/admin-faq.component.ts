import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-admin-faq',
  templateUrl: './admin-faq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    LayoutHeaderAndContentComponent,
    TranslatePipe,
  ],
})
export class AdminFaqComponent {
}
