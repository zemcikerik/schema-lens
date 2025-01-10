import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-help-faq',
  templateUrl: './help-faq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentCardComponent,
    LayoutHeaderAndContentComponent,
    TranslatePipe,
  ],
})
export class HelpFaqComponent {
}
