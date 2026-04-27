import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { DataModelEditor } from '../data-model-editor/data-model-editor.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { DataModelModification } from '../../models/data-model.model';
import { DataModelEdge, DataModelEdgeType } from '../../models/data-model-edge.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DataModelStore } from '../../data-model.store';
import { DataModelEdgeCycleService } from '../../services/data-model-edge-cycle.service';
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
    MatTooltip,
    ReactiveFormsModule,
    SectionHeaderComponent,
    TranslatePipe,
  ],
})
export class DataModelEdgeEditorComponent implements DataModelEditor {
  edge = input.required<DataModelEdge>();

  private store = inject(DataModelStore);
  private fb = inject(FormBuilder);
  private cycleService = inject(DataModelEdgeCycleService);

  readonly form = this.fb.nonNullable.group({
    type: this.fb.nonNullable.control<DataModelEdgeType>('1:N', [Validators.required]),
    isMandatory: this.fb.nonNullable.control<boolean>(false),
    isIdentifying: this.fb.nonNullable.control<boolean>(false),
  });

  edgeModified = false;

  private isIdentifyingValue = toSignal(this.form.controls.isIdentifying.valueChanges, {
    initialValue: this.form.controls.isIdentifying.value,
  });
  private identifyingWouldCycle = computed(() => {
    const edge = this.edge();
    const edges = this.store.edges();
    return this.cycleService.wouldIdentifyingCycle(edges, edge.fromNodeId, edge.toNodeId, edge.edgeId);
  });
  cannotEnableIdentifying = computed(() => !this.isIdentifyingValue() && this.identifyingWouldCycle());

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

    effect(() => {
      const control = this.form.controls.isIdentifying;

      if (this.cannotEnableIdentifying()) {
        control.disable({ emitEvent: false });
      } else {
        control.enable({ emitEvent: false });
      }
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
