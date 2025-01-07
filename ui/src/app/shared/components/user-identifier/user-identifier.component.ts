import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { NgOptimizedImage } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-user-identifier',
  templateUrl: './user-identifier.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatRipple,
    MatMenuModule,
    MatIcon,
    TranslatePipe,
  ],
})
export class UserIdentifierComponent {
  user = input.required<User>();
  language = output();
  logout = output();
}
