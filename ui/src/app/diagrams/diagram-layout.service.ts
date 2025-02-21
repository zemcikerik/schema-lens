import { Injectable } from '@angular/core';
import dagre from '@dagrejs/dagre';

export interface Node {
  id: string;
  width: number;
  height: number;
}

export interface Edge {
  id: string;
  fromId: string;
  toId: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface LayoutResult {
  nodes: Record<string, Point>;
  edges: Record<string, Point[]>
}

@Injectable({ providedIn: 'root' })
export class DiagramLayoutService {

  layoutDigraph(nodes: Node[], edges: Edge[]): LayoutResult {
    const graph = new dagre.graphlib.Graph({ directed: true, multigraph: true, compound: false });
    graph.setGraph({ nodesep: 50, edgesep: 50, ranksep: 75 });
    graph.setDefaultEdgeLabel(() => ({}));

    nodes.forEach(node => graph.setNode(node.id, node));
    edges.forEach(edge => graph.setEdge(edge.fromId, edge.toId, {}, edge.id));

    dagre.layout(graph);

    const laidOutNodesMappings: Record<string, Point> = {};
    const laidOutEdgeMappings: Record<string, Point[]> = {};

    nodes.forEach(({ id, width, height }) => {
      const { x, y } = graph.node(id);
      laidOutNodesMappings[id] = { x: x - width / 2, y: y - height / 2 };
    });

    edges.forEach(({ id, fromId, toId }) => {
      laidOutEdgeMappings[id] = this.removeRedundantMiddlePoint(
        graph.edge({ name: id, v: fromId, w: toId }).points,
      );
    });

    return { nodes: laidOutNodesMappings, edges: laidOutEdgeMappings };
  }

  // for vertical/horizontal lines Dagre includes a redundant middle point
  private removeRedundantMiddlePoint(points: Point[]): Point[] {
    if (points.length !== 3) {
      return points;
    }

    const { x, y } = points[0];

    return (points[1].x === x && points[2].x === x) || (points[1].y === y && points[2].y === y)
      ? [points[0], points[2]]
      : points;
  }

}
