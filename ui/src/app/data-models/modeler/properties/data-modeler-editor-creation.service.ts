import {
  computed,
  inject,
  Injectable,
  signal,
  ViewContainerRef,
  ComponentRef,
  inputBinding,
  Signal,
} from '@angular/core';
import { DataModelStore } from '../../data-model.store';
import { DataModelEditor } from '../../components/data-model-editor/data-model-editor.component';
import { DataModelNodeEditorComponent } from '../../components/data-model-node-editor/data-model-node-editor.component';
import { DataModelEdgeEditorComponent } from '../../components/data-model-edge-editor/data-model-edge-editor.component';
import { DataModelerDiagramEditorComponent } from './data-modeler-diagram-editor.component';
import { DataModelerState } from '../data-modeler.state';
import { DataModelEdge } from '../../models/data-model-edge.model';

export type EditorKind = 'diagram' | 'node' | 'edge';

export interface ResolvedEditor {
  ref: ComponentRef<DataModelEditor> | null;
  titleKey: string;
}

@Injectable()
export class DataModelerEditorCreationService {
  private store = inject(DataModelStore);
  private state = inject(DataModelerState);

  createEditor(kind: EditorKind, target: ViewContainerRef): ResolvedEditor {
    switch (kind) {
      case 'diagram':
        return this.createDiagramEditor(target);
      case 'node':
        return this.createNodeEditor(target);
      case 'edge':
        return this.createEdgeEditor(target);
    }
  }

  private createDiagramEditor(target: ViewContainerRef): ResolvedEditor {
    return {
      ref: target.createComponent(DataModelerDiagramEditorComponent),
      titleKey: 'DATA_MODEL.MODELER.PROPERTIES.DIAGRAM_TITLE',
    };
  }

  private createNodeEditor(target: ViewContainerRef): ResolvedEditor {
    const nodeSignal = computed(() => {
      const selection = this.state.currentSelection();
      return selection?.type === 'node' ? this.store.nodes().find(n => n.nodeId === selection.node.id) ?? null : null;
    });

    if (!nodeSignal()) {
      return { ref: null, titleKey: 'DATA_MODEL.MODELER.PROPERTIES.NODE_TITLE' };
    }

    return {
      ref: target.createComponent(DataModelNodeEditorComponent, {
        bindings: [inputBinding('node', nodeSignal), inputBinding('compact', signal(true))],
      }),
      titleKey: 'DATA_MODEL.MODELER.PROPERTIES.NODE_TITLE',
    };
  }

  private createEdgeEditor(target: ViewContainerRef): ResolvedEditor {
    const edgeSignal = computed(() => {
      const selection = this.state.currentSelection();
      return selection?.type === 'edge' ? this.store.edges().find(e => e.edgeId === selection.edge.id) ?? null : null;
    }) as Signal<DataModelEdge>;

    if (!edgeSignal()) {
      return { ref: null, titleKey: 'DATA_MODEL.MODELER.PROPERTIES.EDGE_TITLE' };
    }

    return {
      ref: target.createComponent(DataModelEdgeEditorComponent, {
        bindings: [inputBinding('edge', edgeSignal), inputBinding('compact', signal(true))],
      }),
      titleKey: 'DATA_MODEL.MODELER.PROPERTIES.EDGE_TITLE',
    };
  }
}
