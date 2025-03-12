export interface Relationship {
  parentName: string;
  childName: string;
  references: RelationshipReference[];
  identifying: boolean;
  mandatory: boolean;
  unique: boolean;
}

export interface RelationshipWithId extends Relationship {
  id: `relationship_${string}`;
}

export interface RelationshipReference {
  parentAttributeName: string;
  childAttributeName: string;
}
