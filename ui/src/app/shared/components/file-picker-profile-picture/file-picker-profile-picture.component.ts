import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { NgOptimizedImage } from '@angular/common';
import {
  BASE_PROFILE_PICTURE_URL,
  DEFAULT_PROFILE_PICTURE_URL,
  PROFILE_PICTURE_EXTENSION,
} from '../profile-picture/profile-picture.component';

interface SelectedFile {
  file: File;
  objectUrl: string;
}

const ALLOWED_PICTURE_MIMETYPES = ['image/png', 'image/jpeg'];

@Component({
  selector: 'app-file-picker-profile-picture',
  templateUrl: './file-picker-profile-picture.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatRipple,
    NgOptimizedImage,
  ],
})
export class FilePickerProfilePictureComponent {
  username = input.required<string>();
  maximumFileSizeInKb = input.required<number>();
  select = output<File>();
  fileSizeTooBig = output();
  disallowedMimeType = output();

  acceptedMimeTypes = ALLOWED_PICTURE_MIMETYPES.join(', ');
  imageUrl = signal<string>(DEFAULT_PROFILE_PICTURE_URL);
  private selectedFile: SelectedFile | null = null;
  private wasModified = false;

  constructor() {
    effect(() => {
      const username = this.username();

      untracked(() => {
        this.imageUrl.set(this.getPictureUrlFor(username));
        this.freeSelectedFile();
        this.wasModified = false;
      });
    });

    inject(DestroyRef).onDestroy(() => this.freeSelectedFile());
  }

  updateSelection(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.item(0) ?? null;

    if (file === null) {
      return;
    }

    if (file.size / 1024 > this.maximumFileSizeInKb()) {
      this.fileSizeTooBig.emit();
      return;
    }

    if (!ALLOWED_PICTURE_MIMETYPES.includes(file.type)) {
      this.disallowedMimeType.emit();
      return;
    }

    this.freeSelectedFile();

    const objectUrl = URL.createObjectURL(file);
    this.imageUrl.set(objectUrl);
    this.selectedFile = { file, objectUrl };
    this.wasModified = true;

    this.select.emit(file);
  }

  fallBackToDefault(): void {
    if (!this.wasModified && this.imageUrl() !== DEFAULT_PROFILE_PICTURE_URL) {
      this.imageUrl.set(DEFAULT_PROFILE_PICTURE_URL);
    }
  }

  private getPictureUrlFor(username: string): string {
    // Date.now() is to prevent caching by browser in picker
    return `${BASE_PROFILE_PICTURE_URL}/${username}.${PROFILE_PICTURE_EXTENSION}?t=${Date.now()}`;
  }

  private freeSelectedFile(): void {
    if (this.selectedFile !== null) {
      URL.revokeObjectURL(this.selectedFile.objectUrl);
      this.selectedFile = null;
    }
  }
}
