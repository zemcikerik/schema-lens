import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CodeEditorComponent } from './shared/components/code-editor/code-editor.component';
import { TopBarComponent } from './top-bar.component';
import { TranslatePipe } from './core/translate/translate.pipe';
import { TranslateService } from './core/translate/translate.service';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    CodeEditorComponent,
    TopBarComponent,
    TranslatePipe,
    AsyncPipe,
    JsonPipe,
  ],
})
export class AppComponent {
  visible = signal(false);
  setLanguage$ = inject(TranslateService).setLanguage('en');
}
