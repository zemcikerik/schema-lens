import { TableConstraintPrimaryKeyComponent } from './table-constraint-primary-key.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TableColumn } from '../../../models/table-column.model';
import { TableConstraintAffectedColumnsComponent } from '../table-constraint-affected-columns/table-constraint-affected-columns.component';

describe('TableConstraintPrimaryKeyComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(TableConstraintPrimaryKeyComponent));

  it('should be created', () => {
    const fixture = MockRender(TableConstraintPrimaryKeyComponent, { affectedColumns: [] });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render affected columns', () => {
    const affectedColumns: TableColumn[] = [
      { name: 'TEST', type: 'VARCHAR2(5)', nullable: false, position: 1 },
      { name: 'SECOND_TEST', type: 'FLOAT', nullable: true, position: 2 },
    ];

    MockRender(TableConstraintPrimaryKeyComponent, { affectedColumns });

    const affectedColumnsElement = ngMocks.find(TableConstraintAffectedColumnsComponent);
    expect(affectedColumnsElement).toBeTruthy();
    expect(ngMocks.input(affectedColumnsElement, 'columns')).toEqual(affectedColumns);
  });
});
