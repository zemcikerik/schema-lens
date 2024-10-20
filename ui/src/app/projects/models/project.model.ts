import { DbType } from '../../core/models/db-type';

export interface Project {
  id: string;
  name: string;
  dbType: DbType;
}
