import { Injectable } from '@angular/core';
import { OracleTypeCategory } from './oracle-type-category.model';

const CHARACTER_TYPES = ['CHAR', 'VARCHAR2', 'NCHAR', 'NVARCHAR2'];
const NUMERIC_TYPES = ['NUMBER', 'FLOAT', 'BINARY_FLOAT', 'BINARY_DOUBLE'];
const RAW_TYPES = ['LONG', 'LONG RAW', 'RAW'];
const DATETIME_TYPES = [
  'DATE', 'TIMESTAMP', 'TIMESTAMP WITH TIME ZONE', 'TIMESTAMP WITH LOCAL TIME ZONE',
  'INTERVAL YEAR TO MONTH', 'INTERVAL DAY TO SECOND',
];
const LARGE_OBJECT_TYPES = ['BLOB', 'CLOB', 'NCLOB', 'BFILE'];
const ROWID_TYPES = ['ROWID', 'UROWID'];

interface CategoryMatcher {
  predicate: (type: string) => boolean;
  category: OracleTypeCategory;
}

@Injectable({
  providedIn: 'root',
})
export class OracleTypeService {

  private readonly CATEGORY_MATCHERS: CategoryMatcher[] = [
    { predicate: type => this.isCharacterType(type), category: 'character' },
    { predicate: type => this.isNumericType(type), category: 'numeric' },
    { predicate: type => this.isRawType(type), category: 'raw' },
    { predicate: type => this.isDatetimeType(type), category: 'datetime' },
    { predicate: type => this.isLargeObjectType(type), category: 'large-object' },
    { predicate: type => this.isRowidType(type), category: 'rowid' },
  ];

  deduceTypeCategory(type: string): OracleTypeCategory | null {
    for (const { predicate, category } of this.CATEGORY_MATCHERS) {
      if (predicate(type)) {
        return category;
      }
    }

    return null;
  }

  isCharacterType(type: string): boolean {
    return CHARACTER_TYPES.includes(this.removeEndTypeParams(type));
  }

  isNumericType(type: string): boolean {
    return NUMERIC_TYPES.includes(this.removeEndTypeParams(type));
  }

  isRawType(type: string): boolean {
    return RAW_TYPES.includes(this.removeEndTypeParams(type));
  }

  isDatetimeType(type: string): boolean {
    return DATETIME_TYPES.includes(this.removeTypeParams(type));
  }

  isLargeObjectType(type: string): boolean {
    return LARGE_OBJECT_TYPES.includes(type);
  }

  isRowidType(type: string): boolean {
    return ROWID_TYPES.includes(this.removeEndTypeParams(type));
  }

  removeTypeParams(type: string): string {
    let paramStartIndex = type.indexOf('(');
    let paramEndIndex = type.indexOf(')');

    while (paramStartIndex !== -1 && paramEndIndex !== -1) {
      type = `${type.substring(0, paramStartIndex)}${type.substring(paramEndIndex + 1)}`;
      paramStartIndex = type.indexOf('(');
      paramEndIndex = type.indexOf(')');
    }

    return type;
  }

  private removeEndTypeParams(type: string): string {
    const paramStartIndex = type.indexOf('(');
    return paramStartIndex !== -1 ? type.substring(0, paramStartIndex) : type;
  }

}
