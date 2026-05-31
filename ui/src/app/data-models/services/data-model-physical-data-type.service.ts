import { Injectable } from '@angular/core';
import { DataModelingDbSystem } from '../data-model-context.state';

export interface DataTypeCategory {
  labelKey: string;
  types: string[];
}

interface DbSystemInfo {
  categories: DataTypeCategory[];
}

const DB_SYSTEM_INFO: Record<DataModelingDbSystem, DbSystemInfo> = {
  oracle: {
    categories: [
      { labelKey: 'ORACLE.TYPE_CATEGORY_LABELS.CHARACTER', types: ['CHAR', 'VARCHAR2', 'NCHAR', 'NVARCHAR2'] },
      { labelKey: 'ORACLE.TYPE_CATEGORY_LABELS.NUMERIC', types: ['NUMBER', 'FLOAT', 'BINARY_FLOAT', 'BINARY_DOUBLE'] },
      { labelKey: 'ORACLE.TYPE_CATEGORY_LABELS.RAW', types: ['LONG', 'LONG RAW', 'RAW'] },
      {
        labelKey: 'ORACLE.TYPE_CATEGORY_LABELS.DATETIME',
        types: [
          'DATE',
          'TIMESTAMP',
          'TIMESTAMP WITH TIME ZONE',
          'TIMESTAMP WITH LOCAL TIME ZONE',
          'INTERVAL YEAR TO MONTH',
          'INTERVAL DAY TO SECOND',
        ],
      },
      { labelKey: 'ORACLE.TYPE_CATEGORY_LABELS.LARGE-OBJECT', types: ['BLOB', 'CLOB', 'NCLOB', 'BFILE'] },
      { labelKey: 'ORACLE.TYPE_CATEGORY_LABELS.ROWID', types: ['ROWID', 'UROWID'] },
    ],
  },
};

@Injectable({
  providedIn: 'root',
})
export class DataModelPhysicalDataTypeService {
  filterCategorizedPhysicalDataTypes(dbSystem: DataModelingDbSystem, searchTerm: string): DataTypeCategory[] {
    const categories = DB_SYSTEM_INFO[dbSystem]?.categories ?? [];

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
