import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { EditorComponent as MonacoEditorComponent } from 'ngx-monaco-editor-v2';

export type CodeEditorLanguage = 'sql' | 'text';

@Component({
  selector: 'app-code-editor',
  template: `
    <ngx-monaco-editor [options]="editorOptions()" />
  `,
  styles: `
      :host {
          display: block;
          height: 100%;
      }

      ngx-monaco-editor {
          height: 100%;
      }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MonacoEditorComponent],
})
export class CodeEditorComponent {
  language = input<CodeEditorLanguage>('text');

  editorOptions = computed(() => ({
    theme: 'vscode',
    language: this.language(),
  }));
}
