import { DataModelEdge, DataModelEdgeField } from './data-model-edge.model';

export interface EdgeFieldModification {
  edge: DataModelEdge;
  field: DataModelEdgeField;
}

export function applyEdgeFieldModifications(modifications: EdgeFieldModification[]): DataModelEdge[] {
  const edgeMap = new Map<number, DataModelEdge>();

  for (const mod of modifications) {
    const edgeId = mod.edge.edgeId as number;
    const base = edgeMap.get(edgeId) ?? { ...mod.edge, fields: [...mod.edge.fields] };

    edgeMap.set(edgeId, {
      ...base,
      fields: base.fields.map(f => (f.referencedFieldId === mod.field.referencedFieldId ? mod.field : f)),
    });
  }

  return [...edgeMap.values()];
}
