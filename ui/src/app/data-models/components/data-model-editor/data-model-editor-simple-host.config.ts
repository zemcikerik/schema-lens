import { DataModelEditor } from './data-model-editor.component';
import { Type } from '@angular/core';
import { TranslationParams } from '../../../core/translate/translate.types';
import { Observable } from 'rxjs';

export interface DataModelEditorSimpleHostConfig<O, E extends DataModelEditor> {
  editorComponent: Type<E>;
  objectInputPropertyKey: keyof E & string;
  objectResolver: (id: number) => O | null;
  titleKey: string;
  titleParamsResolver?: (object: O) => TranslationParams;
  deleteConfirmationOpener: () => Observable<boolean | null>;
  objectDeleter: (id: number) => Observable<unknown>;
}
