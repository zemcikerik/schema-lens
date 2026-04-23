import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';
import { DataModelStore } from '../../data-model.store';
import { DataModelerDiagramState } from '../data-modeler-diagram.state';
import { DataModelerDialogService } from '../data-modeler-dialog.service';
import { DataModelEditor } from '../../components/data-model-editor/data-model-editor.component';
import { DataModelModification } from '../../models/data-model.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { dataModelDiagramNameValidators } from '../../validators/data-model-name.validators';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';

@Component({
  selector: 'app-data-modeler-diagram-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-modeler-diagram-editor.component.html',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton, MatError, TranslatePipe, FormatGenericValidationErrorsPipe, SectionHeaderComponent],
})
export class DataModelerDiagramEditorComponent implements DataModelEditor {
  private store = inject(DataModelStore);
  private state = inject(DataModelerDiagramState);
  private dialogs = inject(DataModelerDialogService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', dataModelDiagramNameValidators()),
  });

  private modified = false;

  constructor() {
    effect(() => {
      const diagram = this.state.activeDiagram();

      if (diagram) {
        this.form.reset({ name: diagram.name });
      }

      this.modified = false;
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => (this.modified = true));
  }

  save(): Observable<DataModelModification> | null {
    if (!this.modified) {
      return null;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return null;
    }

    this.modified = false;

    return this.state
      .updateDiagramName(this.form.getRawValue().name)
      .pipe(map(() =>
        ({ updatedNodes: [], updatedEdges: [], deletedNodeIds: [], deletedEdgeIds: [], visuallyStaleNodeIds: [] }) satisfies DataModelModification
      ));
  }

  delete(): void {
    this.dialogs
      .openDeleteDiagramConfirmation()
      .pipe(
        filter(result => !!result),
        switchMap(() => this.state.deleteDiagram()),
        catchError(() => {
          this.dialogs.openCreationErrorDialog();
          return of(null);
        }),
        filter(result => result !== null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.router.navigate(['/model', this.store.dataModelId]));
  }
}
