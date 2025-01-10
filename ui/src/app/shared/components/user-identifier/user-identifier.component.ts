import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { MatRipple } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';

@Component({
  selector: 'app-user-identifier',
  templateUrl: './user-identifier.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatRipple,
    MatMenuModule,
    MatIcon,
    TranslatePipe,
    ProfilePictureComponent,
  ],
})
export class UserIdentifierComponent {
  user = input.required<User>();
  profile = output();
  language = output();
  help = output();
  logout = output();
}
