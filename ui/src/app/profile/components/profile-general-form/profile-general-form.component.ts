import { ChangeDetectionStrategy, Component, effect, input, output, untracked } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  InteractableProfilePictureComponent
} from '../../../shared/components/interactable-profile-picture/interactable-profile-picture.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateUserInfo } from '../../../core/models/change-user-info.model';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';

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
    ReactiveFormsModule,
    FormatGenericValidationErrorsPipe,
    FormsModule,
  ],
})
export class ProfileGeneralFormComponent {
  user = input.required<User>();
  changeUserInfo = output<UpdateUserInfo>();

  emailControl = new FormControl<string>('', [
    Validators.required,
    Validators.maxLength(128),
    Validators.email
  ]);

  constructor() {
    effect(() => {
      const email = this.user().email;
      untracked(() => this.emailControl.setValue(email));
    });
  }

  submit(): void {
    const email = this.emailControl.value;

    if (this.emailControl.invalid || !email) {
      return;
    }

    this.changeUserInfo.emit({ email });
  }
}
