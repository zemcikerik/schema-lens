export interface TableRelationship {
  parentName: string;
  childName: string;
  identifying: boolean;
  mandatory: boolean;
  unique: boolean;
}
