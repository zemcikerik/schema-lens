import { InputSignal } from '@angular/core';
import { SchemaDiagramSelection } from '../../../diagrams/schema/model/schema-diagram-selection.model';
import { UntypedFormGroup } from '@angular/forms';

export interface BaseDataModelerPropertiesComponent {
  selection: InputSignal<SchemaDiagramSelection | null>;
  readonly propertiesForm?: UntypedFormGroup;
  saveChanges(): void;
}
