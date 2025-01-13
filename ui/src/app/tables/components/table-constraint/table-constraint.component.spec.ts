import { MockBuilder, MockRender, ngMocks, Type } from 'ng-mocks';
import { TableConstraintComponent } from './table-constraint.component';
import { PrimaryKeyTableConstraint, TableConstraint, TableConstraintType } from '../../models/table-constraint.model';
import { TableColumn } from '../../models/table-column.model';
import {
  TableConstraintPrimaryKeyComponent,
} from './table-constraint-primary-key/table-constraint-primary-key.component';
import {
  TableConstraintForeignKeyComponent,
} from './table-constraint-foreign-key/table-constraint-foreign-key.component';
import { TableConstraintCheckComponent } from './table-constraint-check/table-constraint-check.component';
import { TableConstraintUniqueComponent } from './table-constraint-unique/table-constraint-unique.component';

describe('TableConstraintComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(TableConstraintComponent));

  const renderWithMockConstraint = (type: TableConstraintType) => {
    const constraint = { type, columnNames: [] } as unknown as TableConstraint;
    const columns: string [] = [];
    MockRender(TableConstraintComponent, { constraint, columns });
  };

  const expectRenderedComponent = (component: Type<unknown>) =>
    expect(ngMocks.find(component, null));

  it('should be created', () => {
    const constraint: PrimaryKeyTableConstraint = {
      name: 'PK_TEST',
      type: TableConstraintType.PRIMARY_KEY,
      columnNames: [],
    };
    const columns: TableColumn[] = [];

    const fixture = MockRender(TableConstraintComponent, { constraint, columns });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should filter affected columns', () => {
    const constraint: PrimaryKeyTableConstraint = {
      name: 'PK_FAKE_TABLE',
      type: TableConstraintType.PRIMARY_KEY,
      columnNames: ['ID1', 'OTHER'],
    };
    const columns: TableColumn[] = [
      { name: 'ID1', type: 'NUMBER(4,0)', nullable: false, position: 1 },
      { name: 'ID_FAKE', type: 'NUMBER(4,2)', nullable: false, position: 2 },
      { name: 'OTHER', type: 'VARCHAR2(5)', nullable: false, position: 3 },
    ];

    const fixture = MockRender(TableConstraintComponent, { constraint, columns });
    expect(fixture.point.componentInstance.affectedColumns()).toEqual([
      { name: 'ID1', type: 'NUMBER(4,0)', nullable: false, position: 1 },
      { name: 'OTHER', type: 'VARCHAR2(5)', nullable: false, position: 3 },
    ]);
  });

  it('should render primary key constraint for primary key type', () => {
    renderWithMockConstraint(TableConstraintType.PRIMARY_KEY);
    expectRenderedComponent(TableConstraintPrimaryKeyComponent).toBeTruthy();
    expectRenderedComponent(TableConstraintForeignKeyComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintCheckComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintUniqueComponent).toBeFalsy();
  });

  it('should render foreign key constraint for foreign key type', () => {
    renderWithMockConstraint(TableConstraintType.FOREIGN_KEY);
    expectRenderedComponent(TableConstraintPrimaryKeyComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintForeignKeyComponent).toBeTruthy();
    expectRenderedComponent(TableConstraintCheckComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintUniqueComponent).toBeFalsy();
  });

  it('should render check constraint for check type', () => {
    renderWithMockConstraint(TableConstraintType.CHECK);
    expectRenderedComponent(TableConstraintPrimaryKeyComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintForeignKeyComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintCheckComponent).toBeTruthy();
    expectRenderedComponent(TableConstraintUniqueComponent).toBeFalsy();
  });

  it('should render unique constraint for unique type', () => {
    renderWithMockConstraint(TableConstraintType.UNIQUE);
    expectRenderedComponent(TableConstraintPrimaryKeyComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintForeignKeyComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintCheckComponent).toBeFalsy();
    expectRenderedComponent(TableConstraintUniqueComponent).toBeTruthy();
  });
});
