import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';
import { DataModelStore } from '../../data-model.store';
import { DataModelerDiagramState } from '../data-modeler-diagram-state.service';
import { DataModelerDialogService } from '../data-modeler-dialog.service';
import { DataModelEditor } from '../../components/data-model-editor/data-model-editor.component';
import { DataModelModification } from '../../models/data-model.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { dataModelDiagramNameValidators } from '../../validators/data-model-name.validators';

@Component({
  selector: 'app-data-modeler-diagram-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <mat-form-field class="w-100">
        <mat-label>Diagram Name</mat-label>
        <input matInput required formControlName="name" />
      </mat-form-field>
    </form>

    <button mat-stroked-button color="warn" (click)="delete()">Delete Diagram</button>
  `,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
})
export class DataModelerDiagramEditorComponent implements DataModelEditor {
  private store = inject(DataModelStore);
  private state = inject(DataModelerDiagramState);
  private dialogs = inject(DataModelerDialogService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', dataModelDiagramNameValidators()),
  });

  private modified = false;

  constructor() {
    effect(() => {
      const diagram = this.store.activeDiagram();

      if (diagram) {
        this.form.reset({ name: diagram.name });
      }

      this.modified = false;
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => (this.modified = true));
  }

  save(): Observable<DataModelModification> | null {
    if (!this.modified || this.form.invalid) {
      if (this.form.invalid) this.form.markAllAsTouched();
      return null;
    }

    this.modified = false;
    return this.state.updateDiagramName(this.form.getRawValue().name).pipe(
      map(() => ({ updatedNodes: [], updatedEdges: [], deletedNodeIds: [], deletedEdgeIds: [] }) satisfies DataModelModification),
    );
  }

  delete(): void {
    this.dialogs.openDeleteDiagramConfirmation().pipe(
      filter(result => !!result),
      switchMap(() => this.state.deleteDiagram()),
      catchError(() => {
        this.dialogs.openCreationErrorDialog();
        return of(null);
      }),
      takeUntilDestroyed(),
    ).subscribe(result => {
      if (result !== null) {
        this.router.navigate(['/model', this.store.dataModelId]);
      }
    });
  }
}
