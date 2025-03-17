import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  pure: true,
})
export class SafeHtmlPipe implements PipeTransform {

  private domSanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(value);
  }

}
