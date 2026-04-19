import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { DataModelStore } from '../../data-model.store';
import { DataModelerState } from '../data-modeler-state.service';
import { DataModelEditor } from '../../components/data-model-editor/data-model-editor.component';
import { DataModelModification } from '../../models/data-model.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private state = inject(DataModelerState);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(64)]),
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
    this.state.deleteDiagram().pipe(
      tap(() => this.router.navigate(['/model', this.store.dataModelId])),
    ).subscribe();
  }
}
