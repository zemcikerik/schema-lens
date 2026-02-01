import { SchemaDiagramSelection } from '../../diagrams/schema/model/schema-diagram-selection.model';
import { InjectionToken, Type } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from './properties/base-data-modeler-properties.component';

export const DATA_MODELER_DEFINITION = new InjectionToken<DataModelerDefinition>('DATA_MODELER_DEFINITION');

export interface DataModelerDefinition {
  readonly translationTypeReplacement: string;
  getPropertiesComponentFor(selection: SchemaDiagramSelection | null): Type<BaseDataModelerPropertiesComponent>;
}
