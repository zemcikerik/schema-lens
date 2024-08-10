import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CodeEditorComponent } from './shared/components/code-editor/code-editor.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    CodeEditorComponent,
  ],
})
export class AppComponent {
}
