import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DownloadService {

  private document = inject(DOCUMENT);

  downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);

    const anchor = this.document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

}
