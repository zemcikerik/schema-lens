import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile-change-password-form',
  templateUrl: './profile-change-password-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInput,
    TranslatePipe,
    MatButton,
    MatIcon,
  ],
})
export class ProfileChangePasswordFormComponent {
  user = input.required<User>();
}
