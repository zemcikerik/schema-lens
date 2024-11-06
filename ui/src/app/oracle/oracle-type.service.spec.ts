import { OracleTypeService } from './oracle-type.service';

describe('OracleTypeService', () => {
  let service: OracleTypeService;

  beforeEach(() => service = new OracleTypeService());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('deduceTypeCategory', () => {
    [
      { type: 'CHAR(5 CHAR)', category: 'character' },
      { type: 'NVARCHAR2(4)', category: 'character' },
      { type: 'NUMBER(5,2)', category: 'numeric' },
      { type: 'BINARY_FLOAT', category: 'numeric' },
      { type: 'LONG RAW', category: 'raw' },
      { type: 'RAW(30)', category: 'raw' },
      { type: 'TIMESTAMP(6) WITH LOCAL TIME ZONE', category: 'datetime' },
      { type: 'INTERVAL DAY(2) TO SECOND(6)', category: 'datetime' },
      { type: 'BLOB', category: 'large-object' },
      { type: 'BFILE', category: 'large-object' },
      { type: 'ROWID', category: 'rowid' },
      { type: 'UROWID(2000)', category: 'rowid' },
      { type: 'CUSTOM_OBJECT_TYPE', category: null },
    ].forEach(({ type, category }) => {
      it(`should deduce category '${category}' for type '${type}'`, () => {
        expect(service.deduceTypeCategory(type)).toEqual(category);
      });
    });
  });

  describe('isCharacterType', () => {
    [
      { type: 'CHAR', result: true },
      { type: 'CHAR(5)', result: true },
      { type: 'CHAR(5 CHAR)', result: true },
      { type: 'VARCHAR2(42)', result: true },
      { type: 'VARCHAR2(42 CHAR)', result: true },
      { type: 'NCHAR', result: true },
      { type: 'NCHAR(5)', result: true },
      { type: 'NVARCHAR2(7)', result: true },
      { type: 'CHAR_CUSTOM', result: false },
      { type: 'NUMBER(5,2)', result: false },
    ].forEach(({ type, result }) => {
      it(`should return ${result} for type '${type}'`, () => {
        expect(service.isCharacterType(type)).toEqual(result);
      });
    });
  });

  describe('isNumericType', () => {
    [
      { type: 'NUMBER', result: true },
      { type: 'NUMBER(3)', result: true },
      { type: 'NUMBER(3,2)', result: true },
      { type: 'FLOAT', result: true },
      { type: 'FLOAT(64)', result: true },
      { type: 'BINARY_FLOAT', result: true },
      { type: 'BINARY_DOUBLE', result: true },
      { type: 'FAKE_FLOAT', result: false },
      { type: 'LONG', result: false },
    ].forEach(({ type, result }) => {
      it(`should return ${result} for type '${type}'`, () => {
        expect(service.isNumericType(type)).toEqual(result);
      });
    });
  });

  describe('isRawType', () => {
    [
      { type: 'LONG', result: true },
      { type: 'LONG RAW', result: true },
      { type: 'RAW(16)', result: true },
      { type: 'FLOAT(16)', result: false },
      { type: 'NCHAR(42)', result: false },
    ].forEach(({ type, result }) => {
      it(`should return ${result} for type '${type}'`, () => {
        expect(service.isRawType(type)).toEqual(result);
      });
    });
  });

  describe('isDatetimeType', () => {
    [
      { type: 'DATE', result: true },
      { type: 'TIMESTAMP(6)', result: true },
      { type: 'TIMESTAMP(6) WITH TIME ZONE', result: true },
      { type: 'TIMESTAMP(6) WITH LOCAL TIME ZONE', result: true },
      { type: 'INTERVAL YEAR(2) TO MONTH', result: true },
      { type: 'INTERVAL DAY(2) TO SECOND(6)', result: true },
      { type: 'VARCHAR2(10)', result: false },
    ].forEach(({ type, result }) => {
      it(`should return ${result} for type '${type}'`, () => {
        expect(service.isDatetimeType(type)).toEqual(result);
      });
    });
  });

  describe('isLargeObjectType', () => {
    [
      { type: 'BLOB', result: true },
      { type: 'CLOB', result: true },
      { type: 'NCLOB', result: true },
      { type: 'BFILE', result: true },
      { type: 'LONG', result: false },
    ].forEach(({ type, result }) => {
      it(`should return ${result} for type '${type}'`, () => {
        expect(service.isLargeObjectType(type)).toEqual(result);
      });
    });
  });

  describe('isRowidType', () => {
    [
      { type: 'ROWID', result: true },
      { type: 'UROWID', result: true },
      { type: 'UROWID(2000)', result: true },
      { type: 'NUMBER', result: false },
    ].forEach(({ type, result }) => {
      it(`should return ${result} for type '${type}'`, () => {
        expect(service.isRowidType(type)).toEqual(result);
      });
    });
  });
});
