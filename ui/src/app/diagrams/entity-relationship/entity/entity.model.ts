export interface Entity {
  name: string;
  attributes: EntityAttribute[];
  uniqueGroups: string[][];
}

export interface EntityAttribute {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}
