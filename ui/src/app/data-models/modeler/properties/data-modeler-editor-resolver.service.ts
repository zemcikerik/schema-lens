import { computed, inject, Injectable, Signal, signal, ViewContainerRef, ComponentRef, inputBinding } from '@angular/core';
import { SchemaDiagramSelection } from '../../../diagrams/schema/model/schema-diagram-selection.model';
import { DataModelStore } from '../../data-model.store';
import { DataModelEditor } from '../../components/data-model-editor/data-model-editor.component';
import { DataModelNodeEditorComponent } from '../../components/data-model-node-editor/data-model-node-editor.component';
import { DataModelEdgeEditorComponent } from '../../components/data-model-edge-editor/data-model-edge-editor.component';
import { DataModelerDiagramEditorComponent } from './data-modeler-diagram-editor.component';
import { DataModelEdge } from '../../models/data-model-edge.model';

export type EditorKind = 'diagram' | 'node' | 'edge';

@Injectable()
export class DataModelerEditorResolverService {
  private store = inject(DataModelStore);

  editorKind(selection: SchemaDiagramSelection | null): EditorKind {
    return selection?.type ?? 'diagram';
  }

  editorTitle(selection: SchemaDiagramSelection | null): string {
    switch (this.editorKind(selection)) {
      case 'node': return 'Node Properties';
      case 'edge': return 'Edge Properties';
      default: return 'Diagram Properties';
    }
  }

  createEditor(
    selection: Signal<SchemaDiagramSelection | null>,
    target: ViewContainerRef,
  ): ComponentRef<DataModelEditor> | null {
    const kind = this.editorKind(selection());

    if (kind === 'diagram') {
      return target.createComponent(DataModelerDiagramEditorComponent) as ComponentRef<DataModelEditor>;
    }

    if (kind === 'node') {
      const nodeSignal = computed(() => {
        const sel = selection();
        return sel?.type === 'node' ? this.store.nodes().find(n => n.nodeId === sel.node.id) ?? null : null;
      });

      if (!nodeSignal()) {
        return null;
      }

      return target.createComponent(DataModelNodeEditorComponent, {
        bindings: [inputBinding('node', nodeSignal), inputBinding('compact', signal(true))],
      });
    }

    const edgeSignal = computed(() => {
      const sel = selection();
      return sel?.type === 'edge' ? this.store.edges().find(e => e.edgeId === sel.edge.id) ?? null : null;
    }) as Signal<DataModelEdge>;

    if (!edgeSignal()) {
      return null;
    }

    return target.createComponent(DataModelEdgeEditorComponent, {
      bindings: [inputBinding('edge', edgeSignal)],
    });
  }
}
