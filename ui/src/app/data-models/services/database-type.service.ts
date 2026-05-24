import { Injectable } from '@angular/core';
import { DbSystem } from '../models/data-model-data-type.model';

const ORACLE_TYPES = [
  'CHAR', 'VARCHAR2', 'NCHAR', 'NVARCHAR2',
  'NUMBER', 'FLOAT', 'BINARY_FLOAT', 'BINARY_DOUBLE',
  'LONG', 'LONG RAW', 'RAW',
  'DATE', 'TIMESTAMP', 'TIMESTAMP WITH TIME ZONE', 'TIMESTAMP WITH LOCAL TIME ZONE',
  'INTERVAL YEAR TO MONTH', 'INTERVAL DAY TO SECOND',
  'BLOB', 'CLOB', 'NCLOB', 'BFILE',
  'ROWID', 'UROWID',
];

export interface DataTypeCategory {
  category: string;
  types: string[];
}

interface DbSystemInfo {
  types: string[];
  categories: DataTypeCategory[];
}

const DB_SYSTEM_TYPES: Record<DbSystem, DbSystemInfo> = {
  oracle: {
    types: ORACLE_TYPES,
    categories: [
      { category: 'Character', types: ['CHAR', 'VARCHAR2', 'NCHAR', 'NVARCHAR2'] },
      { category: 'Numeric', types: ['NUMBER', 'FLOAT', 'BINARY_FLOAT', 'BINARY_DOUBLE'] },
      { category: 'Raw', types: ['LONG', 'LONG RAW', 'RAW'] },
      { category: 'Date/Time', types: ['DATE', 'TIMESTAMP', 'TIMESTAMP WITH TIME ZONE', 'TIMESTAMP WITH LOCAL TIME ZONE', 'INTERVAL YEAR TO MONTH', 'INTERVAL DAY TO SECOND'] },
      { category: 'Large Objects', types: ['BLOB', 'CLOB', 'NCLOB', 'BFILE'] },
      { category: 'Row ID', types: ['ROWID', 'UROWID'] },
    ],
  },
};

@Injectable({
  providedIn: 'root',
})
export class DatabaseTypeService {
  filterCategorizedPhysicalDataTypes(dbSystem: DbSystem, searchTerm: string): DataTypeCategory[] {
    const categories = DB_SYSTEM_TYPES[dbSystem]?.categories ?? [];

    if (!searchTerm) {
      return categories;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();

    return categories
      .map(category => ({
        ...category,
        types: category.types.filter(type => type.toLowerCase().includes(lowerSearchTerm)),
      }))
      .filter(category => category.types.length > 0);
  }
}





