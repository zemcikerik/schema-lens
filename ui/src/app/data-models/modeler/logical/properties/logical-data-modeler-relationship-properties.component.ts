import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from '../../properties/base-data-modeler-properties.component';
import { SchemaDiagramSelection } from '../../../../diagrams/schema/model/schema-diagram-selection.model';

@Component({
  selector: 'app-logical-data-modeler-relationship-properties',
  templateUrl: './logical-data-modeler-relationship-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogicalDataModelerRelationshipPropertiesComponent implements BaseDataModelerPropertiesComponent {
  selection = input.required<SchemaDiagramSelection | null>();

  saveChanges(): void {
  }
}
