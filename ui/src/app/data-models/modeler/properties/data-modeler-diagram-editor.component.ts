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
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-data-modeler-diagram-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="data-modeler__diagram-editor" [formGroup]="form">
      <div>
        <app-section-header [title]="('DATA_MODEL.MODELER.DIAGRAM.PROPERTIES_LABEL' | translate)()" />
        
        <mat-form-field class="w-100">
          <mat-label>{{ ('DATA_MODEL.MODELER.DIAGRAM.NAME_LABEL' | translate)() }}</mat-label>
          <input matInput required formControlName="name" />
        </mat-form-field>
      </div>

      <div class="data-modeler__diagram-editor__danger-zone">
        <h4 class="data-modeler__diagram-editor__danger-zone__title">
          {{ ('DATA_MODEL.MODELER.DIAGRAM.DANGER_ZONE_LABEL' | translate)() }}
        </h4>
        <button mat-stroked-button (click)="delete()">
          {{ ('DATA_MODEL.MODELER.DIAGRAM.DELETE_LABEL' | translate)() }}
        </button>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton, TranslatePipe, SectionHeaderComponent],
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
    return this.state
      .updateDiagramName(this.form.getRawValue().name)
      .pipe(
        map(
          () => ({ updatedNodes: [], updatedEdges: [], deletedNodeIds: [], deletedEdgeIds: [] }) satisfies DataModelModification,
        ),
      );
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
        takeUntilDestroyed(),
      )
      .subscribe(result => {
        if (result !== null) {
          this.router.navigate(['/model', this.store.dataModelId]);
        }
      });
  }
}
