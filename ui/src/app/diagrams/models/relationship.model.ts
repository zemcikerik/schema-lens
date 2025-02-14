export interface Relationship {
  parentName: string;
  childName: string;
  referencedColumns: RelationshipReference[];
}

export interface RelationshipReference {
  referencedName: string;
  dependantName: string;
}
