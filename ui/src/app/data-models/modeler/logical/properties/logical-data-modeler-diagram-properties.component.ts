import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from '../../properties/base-data-modeler-properties.component';
import { SchemaDiagramSelection } from '../../../../diagrams/schema/model/schema-diagram-selection.model';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-logical-data-modeler-diagram-properties',
  templateUrl: 'logical-data-modeler-diagram-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule],
})
export class LogicalDataModelerDiagramPropertiesComponent implements BaseDataModelerPropertiesComponent {
  selection = input.required<SchemaDiagramSelection | null>();

  private fb = inject(FormBuilder);
  propertiesForm = this.fb.nonNullable.group({
    name: this.fb.nonNullable.control<string>(''/*, [Validators.required, Validators.maxLength(64)]*/),
  });

  saveChanges(): void {}
}
