import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BaseDataModelerPropertiesComponent } from '../../properties/base-data-modeler-properties.component';
import {
  SchemaDiagramEdgeSelection,
  SchemaDiagramSelection,
} from '../../../../diagrams/schema/model/schema-diagram-selection.model';
import { LogicalModelStore } from '../../../logical-model.store';
import { LogicalDataModelingFacade } from '../logical-data-modeling.facade';

@Component({
  selector: 'app-logical-data-modeler-relationship-properties',
  templateUrl: './logical-data-modeler-relationship-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogicalDataModelerRelationshipPropertiesComponent implements BaseDataModelerPropertiesComponent {
  selection = input.required<SchemaDiagramSelection | null>();
  private store = inject(LogicalModelStore);
  private facade = inject(LogicalDataModelingFacade);

  currentRelationship = computed(() => {
    const { edge } = this.selection() as SchemaDiagramEdgeSelection;
    const relationship = this.store.relationships().find(r => r.relationshipId === edge.id);

    if (!relationship) {
      throw new Error('Relationship couldn\'t be resolved');
    }

    return relationship;
  });

  saveChanges(): void {
    this.facade.updateRelationship(this.currentRelationship());
  }
}
