export interface Entity {
  name: string;
  attributes: EntityAttribute[];
}

export interface EntityAttribute {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}
