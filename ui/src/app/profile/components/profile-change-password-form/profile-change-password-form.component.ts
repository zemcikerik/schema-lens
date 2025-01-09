import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { verifyPasswordValidator } from '../../../core/validators/verify-password.validator';
import { ChangePassword } from '../../../core/models/change-password.model';

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
    FormatGenericValidationErrorsPipe,
    ReactiveFormsModule,
  ],
})
export class ProfileChangePasswordFormComponent {
  user = input.required<User>();
  changePassword = output<ChangePassword>();

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    verifyPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor() {
    const { newPassword, verifyPassword } = this.passwordForm.controls;
    verifyPassword.addValidators(verifyPasswordValidator(newPassword));
  }

  submit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const { oldPassword, newPassword } = this.passwordForm.value;

    if (oldPassword && newPassword) {
      this.changePassword.emit({ oldPassword, newPassword });
    }
  }
}
