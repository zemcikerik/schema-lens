import { ChangeDetectionStrategy, Component, computed, forwardRef, input, viewChild } from '@angular/core';
import { EditorComponent as MonacoEditorComponent } from 'ngx-monaco-editor-v2';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CodeEditorLanguage = 'sql' | 'text';

@Component({
  selector: 'app-code-editor',
  template: `
    <ngx-monaco-editor [options]="editorOptions()" [insideNg]="false" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MonacoEditorComponent],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CodeEditorComponent), multi: true },
  ],
})
export class CodeEditorComponent implements ControlValueAccessor {
  language = input<CodeEditorLanguage>('text');
  readonly = input<boolean>(false);
  editor = viewChild.required(MonacoEditorComponent);

  editorOptions = computed(() => ({
    theme: 'vscode',
    language: this.language(),
    readOnly: this.readonly(),
    minimap: { enabled: false },
    wordWrap: true,
  }));

  registerOnChange(fn: unknown): void {
    this.editor().registerOnChange(fn);
  }

  registerOnTouched(fn: unknown): void {
    this.editor().registerOnTouched(fn);
  }

  writeValue(value: unknown): void {
    this.editor().writeValue(value);
  }
}
