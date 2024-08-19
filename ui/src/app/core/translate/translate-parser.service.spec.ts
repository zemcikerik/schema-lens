import { TranslateParserService } from './translate-parser.service';

describe('TranslateParserService', () => {
  let service: TranslateParserService;

  beforeEach(() => {
    service = new TranslateParserService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse translations in message format syntax', () => {
    const result = service.parseRawTranslations('en', {
      'KEY_SIMPLE': 'Hello, World!',
      'KEY_WITH_VARIABLE': 'Variable: {var}',
      'KEY_WITH_SELECT': 'Select: {var, select, 1 {first} 2 {second} other {unknown}}',
      'KEY_WITH_PLURAL': 'Plural: {count, plural, =0 {none} one {single} other {n #}}',
    });

    expect(result['KEY_SIMPLE']()).toEqual('Hello, World!');
    expect(result['KEY_WITH_VARIABLE']({ var: 'val' })).toEqual('Variable: val');
    expect(result['KEY_WITH_SELECT']({ var: 1 })).toEqual('Select: first');
    expect(result['KEY_WITH_SELECT']({ var: 2 })).toEqual('Select: second');
    expect(result['KEY_WITH_SELECT']({ var: 3 })).toEqual('Select: unknown');
    expect(result['KEY_WITH_PLURAL']({ count: 0 })).toEqual('Plural: none');
    expect(result['KEY_WITH_PLURAL']({ count: 1 })).toEqual('Plural: single');
    expect(result['KEY_WITH_PLURAL']({ count: 5 })).toEqual('Plural: n 5');
  });

  it('should flatten grouped translations', () => {
    const result = service.parseRawTranslations('en', {
      'FLAT': 'Flat structure',
      'PARENT': {
        'CHILD': 'Nested structure',
      },
    });

    expect(result['FLAT']()).toEqual('Flat structure');
    expect(result['PARENT.CHILD']()).toEqual('Nested structure');
  });
});
