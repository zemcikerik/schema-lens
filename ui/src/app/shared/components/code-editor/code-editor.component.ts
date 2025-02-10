import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, NgZone, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorState } from '@codemirror/state';
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  ViewUpdate,
} from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { PLSQL, sql } from '@codemirror/lang-sql';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';

@Component({
  selector: 'app-code-editor',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CodeEditorComponent), multi: true },
  ],
})
export class CodeEditorComponent implements ControlValueAccessor, OnDestroy {
  private view: EditorView;
  private ngZone = inject(NgZone);

  private onChange: (value: string) => void = () => void 0;
  private onTouched: () => void = () => void 0;

  constructor() {
    const elementRef = inject(ElementRef);

    this.view = this.ngZone.runOutsideAngular(() => {
      const state = EditorState.create({
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          drawSelection(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          keymap.of(defaultKeymap),
          sql({ dialect: PLSQL }),
          EditorView.lineWrapping,
          EditorView.updateListener.of(update => this.handleViewUpdate(update)),
          EditorState.readOnly.of(true),
        ],
      });

      return new EditorView({ state, parent: elementRef.nativeElement });
    });
  }

  private handleViewUpdate(update: ViewUpdate): void {
    if (update.docChanged) {
      this.ngZone.run(() => this.onChange(update.state.doc.toString()));
    }
    if (update.focusChanged && !update.view.hasFocus) {
      this.ngZone.run(() => this.onTouched());
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: string): void {
    this.ngZone.runOutsideAngular(() => {
      this.view.dispatch({
        changes: { from: 0, to: this.view.state.doc.length, insert: value },
      });
    });
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => this.view.destroy());
  }
}
