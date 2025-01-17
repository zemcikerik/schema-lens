import { ChangeDetectionStrategy, Component, effect, input, signal, untracked } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

export const DEFAULT_PROFILE_PICTURE_URL = '/static/img/default-profile-picture.png';
export const BASE_PROFILE_PICTURE_URL = '/static/profile-pictures';
export const PROFILE_PICTURE_EXTENSION = 'png';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgOptimizedImage,
  ],
})
export class ProfilePictureComponent {
  username = input.required<string>();
  imageUrl = signal<string>(DEFAULT_PROFILE_PICTURE_URL);

  constructor() {
    effect(() => {
      const username = this.username();

      untracked(() =>
        this.imageUrl.set(`${BASE_PROFILE_PICTURE_URL}/${username}.${PROFILE_PICTURE_EXTENSION}`)
      );
    });
  }

  fallBackToDefault(): void {
    if (this.imageUrl() !== DEFAULT_PROFILE_PICTURE_URL) {
      this.imageUrl.set(DEFAULT_PROFILE_PICTURE_URL);
    }
  }
}
