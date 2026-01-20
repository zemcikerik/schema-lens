import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { DiagramHostComponent } from '../diagram-host.component';
import {
  AngularComponentShapeRenderer,
  AngularComponentShapeRendererFactory,
} from '../angular/angular-component-shape-renderer.module';
import { AngularSelectionSupportModuleFactory } from '../angular/angular-selection-support.module';
import { SchemaDiagramNodeComponent } from './node/schema-diagram-node.component';
import { SchemaDiagramNodeModule } from './node/schema-diagram-node.module';
import { NoMultiSelectModule } from '../util/no-multi-select.module';
import { EMPTY, Observable, switchMap } from 'rxjs';
import {
  AddEdgePatch,
  AddNodePatch,
  SchemaDiagramPatch,
} from './model/schema-diagram-patches.model';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DiagramExportControlComponent } from '../export/diagram-export-control.component';
import { DiagramFullscreenControlComponent } from '../diagram-fullscreen-control.component';
import { DiagramGridControlComponent } from '../diagram-grid-control.component';
import { DiagramZoomControlComponent } from '../diagram-zoom-control.component';
import { FullscreenDirective } from '../../core/directives/fullscreen.directive';
import { SchemaDiagramEdgeModule } from './edge/schema-diagram-edge.module';
import { SchemaDiagramNode } from './model/schema-diagram-node.model';
import { SchemaDiagramNodeShape } from './node/schema-diagram-node.shape';
import { SchemaDiagramEdge } from './model/schema-diagram-edge.model';
import { isEdgeConnection, SchemaDiagramEdgeConnection } from './edge/schema-diagram-edge.connection';
import { DiagramLayoutService, LayoutEdge, LayoutNode } from '../diagram-layout.service';
import { Connection, ElementLike } from 'diagram-js/lib/model/Types';
import { isConnection } from 'diagram-js/lib/util/ModelUtil';

interface NodeEntry {
  readonly node: SchemaDiagramNode;
  readonly shape: SchemaDiagramNodeShape;
}

interface EdgeEntry {
  readonly edge: SchemaDiagramEdge;
  readonly connection: SchemaDiagramEdgeConnection;
}

@Component({
  selector: 'app-schema-diagram',
  templateUrl: './schema-diagram.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DiagramHostComponent,
    DiagramExportControlComponent,
    DiagramFullscreenControlComponent,
    DiagramGridControlComponent,
    DiagramZoomControlComponent,
    FullscreenDirective,
  ],
})
export class SchemaDiagramComponent implements AfterViewInit {
  patches$ = input<Observable<SchemaDiagramPatch>>(EMPTY);
  diagramHost = viewChild.required(DiagramHostComponent);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  private angularRenderer: AngularComponentShapeRenderer = null!; // initialized after view init
  private diagramLayoutService = inject(DiagramLayoutService);

  readonly MODULES = [
    AngularComponentShapeRendererFactory.create({ node: SchemaDiagramNodeComponent }),
    AngularSelectionSupportModuleFactory.create({
      selectionChange: (oldSelection, newSelection) =>
        this.updateRelationshipHighlightFromSelection(oldSelection, newSelection),
    }),
    SchemaDiagramNodeModule,
    SchemaDiagramEdgeModule,
    NoMultiSelectModule,
  ];

  nodes: Record<number, NodeEntry> = {};
  edges: Record<number, EdgeEntry> = {};

  constructor() {
    toObservable(this.patches$).pipe(
      switchMap(patches$ => patches$),
      takeUntilDestroyed(),
    ).subscribe(patch => this.dispatchPatch(patch));
  }

  ngAfterViewInit(): void {
    this.angularRenderer = this.diagramHost().runInDiagramContext<AngularComponentShapeRenderer>(
      diagram => diagram.get('angularComponentShapeRenderer'),
    );
  }

  private dispatchPatch(patch: SchemaDiagramPatch): void {
    if (patch.type === 'node:add') {
      this.addNode(patch);
    } else if (patch.type === 'edge:add') {
      this.addEdge(patch);
    } else if (patch.type === 'layout:auto') {
      this.autoLayout();
    } else {
      throw new Error('Unknown patch type');
    }
  }

  private addNode({ node, position }: AddNodePatch): void {
    if (this.nodes[node.id]) {
      throw new Error('Node already exists');
    }

    const minDimensions = SchemaDiagramNodeComponent.estimateDimensions(node);
    const x = position?.x ?? 0;
    const y = position?.y ?? 0;
    const width = position?.width ? Math.max(position.width, minDimensions.width) : minDimensions.width;
    const height = position?.height ? Math.max(position.height, minDimensions.height) : minDimensions.height;

    const shape = this.diagramHost().addShape({
      id: `node_${node.id}`,
      x, y, width, height,
      node, minDimensions,
    }) as SchemaDiagramNodeShape;
    this.angularRenderer.setShapeInput(shape, 'node', node);

    this.nodes[node.id] = { node, shape };
  }

  private addEdge({ edge, position }: AddEdgePatch): void {
    if (this.edges[edge.id]) {
      throw new Error('Edge already exists');
    }

    const fromNode = this.nodes[edge.fromNode];
    const toNode = this.nodes[edge.toNode];

    if (!fromNode || !toNode) {
      throw new Error('Edge references non-existing node');
    }

    const waypoints = position?.points && position?.points.length > 1 ? position.points : undefined;

    const connection = position?.points && position?.points.length > 1
      ? this.diagramHost().addConnection({
          id: `edge_${edge.id}`,
          source: fromNode.shape,
          target: toNode.shape,
          waypoints,
          edge,
        })
      : this.diagramHost().connect(fromNode.shape, toNode.shape, { id: `edge_${edge.id}`, edge });

    this.edges[edge.id] = { edge, connection: connection as SchemaDiagramEdgeConnection };
  }

  private autoLayout(): void {
    const layoutNodes: LayoutNode[] = Object
      .values(this.nodes)
      .map(({ shape }) => ({ id: shape.id, width: shape.width, height: shape.height }));

    const layoutEdges: LayoutEdge[] = Object.values(this.edges).map(({ connection }) =>
      ({ id: connection.id, fromId: String(connection.source?.id), toId: String(connection.target?.id) })
    );

    const layout = this.diagramLayoutService.layoutDigraph(layoutNodes, layoutEdges);

    const updatedElements = [
      ...Object.values(this.nodes).map(({ shape }) => shape),
      ...Object.values(this.edges).map(({ connection }) => connection),
    ];
    const edgeUpdates = Object.entries(layout.edges).map(([id, waypoints]) => [id, { waypoints }]);
    const updates = { ...layout.nodes, ...Object.fromEntries(edgeUpdates) };

    this.diagramHost().updateAll(updatedElements, updates);
  }

  private updateRelationshipHighlightFromSelection(oldSelection: ElementLike[], newSelection: ElementLike[]): void {
    const resolveSelectedEdgeConnections = (selection: ElementLike[]): SchemaDiagramEdgeConnection[] =>
      selection.some(element => !isConnection(element) || !isEdgeConnection(element as Connection))
        ? [] : selection as SchemaDiagramEdgeConnection[];

    const highlightUpdates: Record<number, number[]> = {};
    resolveSelectedEdgeConnections(oldSelection).forEach(({ edge }) => highlightUpdates[edge.toNode] = []);
    resolveSelectedEdgeConnections(newSelection).forEach(({ edge }) => (highlightUpdates[edge.toNode] ??= []).push(edge.id));

    Object.entries(highlightUpdates).forEach(([nodeId, edgeIds]) =>
      this.angularRenderer.setShapeInput(this.nodes[+nodeId].shape, 'highlightEdgeIds', edgeIds)
    );
  }
}
