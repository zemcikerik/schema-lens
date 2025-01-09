import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/models/user.model';
import { ProfileGeneralFormComponent } from '../profile-general-form/profile-general-form.component';
import {
  ProfileChangePasswordFormComponent
} from '../profile-change-password-form/profile-change-password-form.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentCardComponent,
    LayoutHeaderAndContentComponent,
    TranslatePipe,
    ProfileGeneralFormComponent,
    ProfileChangePasswordFormComponent,
    MatButton,
    MatIcon,
  ],
})
export class ProfileComponent {
  user = inject(AuthService).currentUser as Signal<User>;
}
