import { TableConstraintUniqueComponent } from './table-constraint-unique.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TableColumn } from '../../../models/table-column.model';
import { TableConstraintAffectedColumnsComponent } from '../table-constraint-affected-columns/table-constraint-affected-columns.component';

describe('TableConstraintUniqueComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(TableConstraintUniqueComponent));

  it('should be created', () => {
    const fixture = MockRender(TableConstraintUniqueComponent, { affectedColumns: [] });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render affected columns', () => {
    const affectedColumns: TableColumn[] = [
      { name: 'TEST', type: 'VARCHAR2(5)', nullable: false, position: 1 },
      { name: 'SECOND_TEST', type: 'FLOAT', nullable: true, position: 2 },
    ];

    MockRender(TableConstraintUniqueComponent, { affectedColumns });

    const affectedColumnsElement = ngMocks.find(TableConstraintAffectedColumnsComponent);
    expect(affectedColumnsElement).toBeTruthy();
    expect(ngMocks.input(affectedColumnsElement, 'columns')).toEqual(affectedColumns);
  });
});
