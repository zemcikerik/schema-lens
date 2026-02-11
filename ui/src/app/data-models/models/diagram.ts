export interface Diagram {
  id: number | null,
  name: string,
  type: string,

  entities: DiagramEntity[] | null,
  relationships: DiagramRelationship[] | null
}

export interface DiagramEntity {
  entityId: number,
  x: number,
  y: number,
  width: number,
  height: number
}

export interface DiagramRelationship {
  relationshipId: number,
  points: {
    x: number,
    y: number
  }[]
}