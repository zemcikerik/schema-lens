import { TableConstraintIconComponent } from './table-constraint-icon.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { signal } from '@angular/core';
import { TableConstraintType } from '../../models/table-constraint.model';

describe('TableConstraintIconComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(TableConstraintIconComponent)
    .mock(TranslatePipe, v => signal(v)));

  const render = (type: TableConstraintType): TableConstraintIconComponent => {
    const fixture = MockRender(TableConstraintIconComponent, { type });
    return fixture.point.componentInstance;
  };

  it('should be created', () => {
    expect(render('primary-key')).toBeTruthy();
  });

  it('should be rendered for primary key type', () => {
    const component = render('primary-key');
    expect(component.icon()).toEqual('key');
    expect(component.label()).toEqual('TABLES.CONSTRAINTS.TYPE.PRIMARY-KEY');
  });

  it('should be rendered for foreign key type', () => {
    const component = render('foreign-key');
    expect(component.icon()).toEqual('key_vertical');
    expect(component.label()).toEqual('TABLES.CONSTRAINTS.TYPE.FOREIGN-KEY');
  });

  it('should be rendered for check type', () => {
    const component = render('check');
    expect(component.icon()).toEqual('lock');
    expect(component.label()).toEqual('TABLES.CONSTRAINTS.TYPE.CHECK');
  });

  it('should be rendered for unique type', () => {
    const component = render('unique');
    expect(component.icon()).toEqual('verified');
    expect(component.label()).toEqual('TABLES.CONSTRAINTS.TYPE.UNIQUE');
  });
});
