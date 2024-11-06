import { TableColumnIconComponent } from './table-column-icon.component';
import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { OracleTypeService } from '../../../oracle/oracle-type.service';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { computed } from '@angular/core';

describe('TableColumnIconComponent', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => MockBuilder(TableColumnIconComponent)
    .mock(TranslatePipe, v => computed(() => v)));

  const render = (type: string): TableColumnIconComponent =>
    MockRender(TableColumnIconComponent, { type }).point.componentInstance;

  it('should be created', () => {
    expect(render('TYPE')).toBeTruthy();
  });

  it('should use preset icon for determined category', () => {
    MockInstance(OracleTypeService, 'deduceTypeCategory', () => 'character');
    const component = render('VARCHAR2(5)');
    expect(component.icon()).not.toEqual('help');
  });

  it('should use default icon for unknown category', () => {
    MockInstance(OracleTypeService, 'deduceTypeCategory', () => null);
    const component = render('CUSTOM_TYPE');
    expect(component.icon()).toEqual('help');
  });

  it('should have tooltip with category label for determined category', () => {
    MockInstance(OracleTypeService, 'deduceTypeCategory', () => 'numeric');
    const component = render('NUMBER(4,2)');
    expect(component.categoryLabel()).toContain('NUMERIC');
  });

  it('should have tooltip with category label for unknown category', () => {
    MockInstance(OracleTypeService, 'deduceTypeCategory', () => null);
    const component = render('UNKNOWN');
    expect(component.categoryLabel()).toContain('UNKNOWN');
  });
});
