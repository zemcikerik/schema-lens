import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from './core/translate/translate.pipe';

@Component({
  selector: 'app-error-404',
  template: `
    <div class="error-404">
      <div class="error-404__image">
        <img ngSrc="/static/img/404.png" fill priority alt="404">
      </div>
      <div>
        <h2>{{ ('404_LABEL' | translate)() }}</h2>
        <span>{{ ('404_DESCRIPTION' | translate)() }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgOptimizedImage,
    TranslatePipe,
  ],
})
export class Error404Component {
}
