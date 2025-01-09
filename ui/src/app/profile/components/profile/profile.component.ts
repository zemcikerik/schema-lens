import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentCardComponent,
  ],
})
export class ProfileComponent {
}
