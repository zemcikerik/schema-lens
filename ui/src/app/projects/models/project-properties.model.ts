import { DbType } from '../../core/models/db-type';

interface BaseProjectProperties {
  id: string | null;
  name: string;
  dbType: DbType;
  owner: string;
}

export interface OracleProjectProperties extends BaseProjectProperties {
  dbType: 'oracle';
  connection: OracleConnectionProperties;
}

export type ProjectProperties = OracleProjectProperties;

export interface OracleConnectionProperties {
  host: string;
  port: number;
  service: string;
  username: string;
  password: string;
}
