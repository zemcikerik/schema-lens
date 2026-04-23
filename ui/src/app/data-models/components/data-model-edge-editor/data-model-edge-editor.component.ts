import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { DataModelEditor } from '../data-model-editor/data-model-editor.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { DataModelModification } from '../../models/data-model.model';
import { DataModelEdge, DataModelEdgeType } from '../../models/data-model-edge.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataModelStore } from '../../data-model.store';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-model-edge-editor',
  templateUrl: './data-model-edge-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCheckbox,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    SectionHeaderComponent,
    TranslatePipe,
  ],
})
export class DataModelEdgeEditorComponent implements DataModelEditor {
  edge = input.required<DataModelEdge>();

  private store = inject(DataModelStore);
  private fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<DataModelEdgeType>('1:N', [Validators.required]),
    isMandatory: this.fb.nonNullable.control<boolean>(false),
    isIdentifying: this.fb.nonNullable.control<boolean>(false),
  });

  edgeModified = false;

  constructor() {
    effect(() => {
      const edge = this.edge();

      this.form.reset({
        type: edge.type,
        isMandatory: edge.isMandatory,
        isIdentifying: edge.isIdentifying,
      });

      this.edgeModified = false;
    });

    this.form.controls.isIdentifying.valueChanges.pipe(takeUntilDestroyed()).subscribe(isIdentifying => {
      const mandatory = this.form.controls.isMandatory;

      if (isIdentifying) {
        mandatory.setValue(true, { emitEvent: false });
        mandatory.disable({ emitEvent: false });
      } else {
        mandatory.enable({ emitEvent: false });
      }
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => (this.edgeModified = true));
  }

  save(): Observable<DataModelModification> | null {
    if (!this.edgeModified) {
      return null;
    }

    const { type, isMandatory, isIdentifying } = this.form.getRawValue();
    const updated: DataModelEdge = { ...this.edge(), type, isMandatory, isIdentifying };

    return this.store.updateEdge(updated).pipe(tap(() => (this.edgeModified = false)));
  }
}
