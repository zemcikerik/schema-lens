import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-interactable-profile-picture',
  templateUrl: './interactable-profile-picture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatRipple,
  ],
})
export class InteractableProfilePictureComponent {
  username = input.required<string>();
  select = output();
}
