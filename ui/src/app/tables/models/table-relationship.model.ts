export interface TableRelationship {
  parentName: string;
  childName: string;
  references: TableRelationshipReference[];
  identifying: boolean;
  mandatory: boolean;
  unique: boolean;
}

export interface TableRelationshipReference {
  parentColumnName: string;
  childColumnName: string;
}
