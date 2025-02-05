import { TableConstraintCheckComponent } from './table-constraint-check.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { CheckTableConstraint, TableConstraintType } from '../../../models/table-constraint.model';
import { TableColumn } from '../../../models/table-column.model';
import {
  TableConstraintAffectedColumnsComponent,
} from '../table-constraint-affected-columns/table-constraint-affected-columns.component';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';
import { signal } from '@angular/core';

describe('TableConstraintCheckComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(TableConstraintCheckComponent)
    .mock(TranslatePipe, v => signal(v)));

  it('should be created', () => {
    const constraint: CheckTableConstraint = {
      name: 'TEST_CHECK',
      type: TableConstraintType.CHECK,
      columnNames: [],
      enabled: true,
      invalid: false,
      condition: '1=1',
    };
    const affectedColumns: TableColumn[] = [];

    const fixture = MockRender(TableConstraintCheckComponent, { constraint, affectedColumns });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render check condition', () => {
    const constraint: CheckTableConstraint = {
      name: 'TEST_CHECK',
      type: TableConstraintType.CHECK,
      columnNames: ['TEST_COLUMN'],
      enabled: true,
      invalid: false,
      condition: 'TEST_COLUMN IS NOT NULL',
    };
    const affectedColumns: TableColumn[] = [
      { name: 'TEST_COLUMN', type: 'VARCHAR2(50)', nullable: true, position: 1 },
    ];

    MockRender(TableConstraintCheckComponent, { constraint, affectedColumns });

    const conditionContainerElement: HTMLDivElement = ngMocks.find('div').nativeElement;
    const renderedCondition = ngMocks.formatText(conditionContainerElement.lastChild?.textContent ?? '');
    expect(renderedCondition).toEqual('TEST_COLUMN IS NOT NULL');
  });

  it('should render affected columns', () => {
    const constraint: CheckTableConstraint = {
      name: 'PRICE_POSITIVE',
      type: TableConstraintType.CHECK,
      columnNames: ['PRICE'],
      enabled: true,
      invalid: false,
      condition: 'PRICE > 0',
    };
    const affectedColumns: TableColumn[] = [
      { name: 'PRICE', type: 'NUMBER(8,2)', nullable: true, position: 1 },
    ];

    MockRender(TableConstraintCheckComponent, { constraint, affectedColumns });

    const affectedColumnsElement = ngMocks.find(TableConstraintAffectedColumnsComponent);
    expect(affectedColumnsElement).toBeTruthy();
    expect(ngMocks.input(affectedColumnsElement, 'columns')).toEqual(affectedColumns);
  });
});
