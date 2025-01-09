import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  InteractableProfilePictureComponent
} from '../../../shared/components/interactable-profile-picture/interactable-profile-picture.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-profile-general-form',
  templateUrl: './profile-general-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInput,
    InteractableProfilePictureComponent,
    TranslatePipe,
    MatButton,
    MatIcon,
  ],
})
export class ProfileGeneralFormComponent {
  user = input.required<User>();
}
