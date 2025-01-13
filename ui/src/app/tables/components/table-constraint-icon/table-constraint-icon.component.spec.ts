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
    expect(render(TableConstraintType.PRIMARY_KEY)).toBeTruthy();
  });

  it('should be rendered for primary key type', () => {
    const component = render(TableConstraintType.PRIMARY_KEY);
    expect(component.icon()).toEqual('key');
  });

  it('should be rendered for foreign key type', () => {
    const component = render(TableConstraintType.FOREIGN_KEY);
    expect(component.icon()).toEqual('key_vertical');
  });

  it('should be rendered for check type', () => {
    const component = render(TableConstraintType.CHECK);
    expect(component.icon()).toEqual('lock');
  });

  it('should be rendered for unique type', () => {
    const component = render(TableConstraintType.UNIQUE);
    expect(component.icon()).toEqual('verified');
  });
});
