import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from '../../properties/base-data-modeler-properties.component';
import { SchemaDiagramSelection } from '../../../../diagrams/schema/model/schema-diagram-selection.model';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogicalModelStore } from '../../../logical-model.store';
import { LogicalDataModelingFacade } from '../logical-data-modeling.facade';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';

@Component({
  selector: 'app-logical-data-modeler-diagram-properties',
  templateUrl: 'logical-data-modeler-diagram-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatButton, TranslatePipe],
})
export class LogicalDataModelerDiagramPropertiesComponent implements BaseDataModelerPropertiesComponent {
  selection = input.required<SchemaDiagramSelection | null>();

  private store = inject(LogicalModelStore);
  private facade = inject(LogicalDataModelingFacade);
  private router = inject(Router);
  private formModified = false;
  private fb = inject(FormBuilder);

  propertiesForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control<string>('', [Validators.required, Validators.maxLength(64)]),
  });

  constructor() {
    toObservable(this.store.activeDiagram).pipe(takeUntilDestroyed()).subscribe(diagram => {
      if (diagram) {
        this.propertiesForm.reset({ name: diagram.name });
      }
      this.formModified = false;
    });

    this.propertiesForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => (this.formModified = true));
  }

  saveChanges(): void {
    if (!this.formModified) {
      return;
    }

    this.formModified = false;
    this.facade.updateDiagramName(this.propertiesForm.getRawValue().name);
  }

  deleteDiagram(): void {
    this.facade.deleteDiagram().subscribe(() => {
      this.router.navigate(['/model', this.store.dataModelId]);
    });
  }
}
