import { DataModelerDefinition } from '../data-modeler.definition';
import { SchemaDiagramSelection } from '../../../diagrams/schema/model/schema-diagram-selection.model';
import { BaseDataModelerPropertiesComponent } from '../properties/base-data-modeler-properties.component';
import { Type } from '@angular/core';
import { LogicalDataModelerDiagramPropertiesComponent } from './properties/logical-data-modeler-diagram-properties.component';
import { LogicalDataModelerEntityPropertiesComponent } from './properties/logical-data-modeler-entity-properties.component';
import { LogicalDataModelerRelationshipPropertiesComponent } from './properties/logical-data-modeler-relationship-properties.component';

export class LogicalDataModelerDefinition implements DataModelerDefinition {
  readonly translationTypeReplacement = 'LOGICAL';

  getPropertiesComponentFor(selection: SchemaDiagramSelection | null): Type<BaseDataModelerPropertiesComponent> {
    return {
      diagram: LogicalDataModelerDiagramPropertiesComponent,
      node: LogicalDataModelerEntityPropertiesComponent,
      edge: LogicalDataModelerRelationshipPropertiesComponent,
    }[selection?.type ?? 'diagram'];
  }
}
