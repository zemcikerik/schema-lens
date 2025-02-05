import { TableConstraintForeignKeyComponent } from './table-constraint-foreign-key.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';
import { signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ForeignKeyTableConstraint, TableConstraintType } from '../../../models/table-constraint.model';
import { TableColumn } from '../../../models/table-column.model';

describe('TableConstraintForeignKeyComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(TableConstraintForeignKeyComponent)
    .mock(TranslatePipe, v => signal(v))
    .keep(MatTableModule));

  it('should be created', () => {
    const constraint: ForeignKeyTableConstraint = {
      name: 'FK_MOCK',
      type: TableConstraintType.FOREIGN_KEY,
      columnNames: [],
      enabled: true,
      invalid: false,
      referencedConstraintName: 'PK_MOCK_TABLE',
      referencedTableName: 'MOCK_TABLE',
      references: [],
    };
    const affectedColumns: TableColumn[] = [];

    const fixture = MockRender(TableConstraintForeignKeyComponent, { constraint, affectedColumns });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render row with name and referenced constraint/table/column for each column', () => {
    const constraint: ForeignKeyTableConstraint = {
      name: 'FK_ROLE_USER',
      type: TableConstraintType.FOREIGN_KEY,
      columnNames: ['USER_NAME', 'USER_EMAIL'],
      enabled: true,
      invalid: false,
      referencedConstraintName: 'PK_USER',
      referencedTableName: 'USER',
      references: [
        { columnName: 'USER_NAME', referencedColumnName: 'NAME' },
        { columnName: 'USER_EMAIL', referencedColumnName: 'EMAIL' },
      ],
    };
    const affectedColumns: TableColumn[] = [
      { name: 'USER_NAME', type: 'VARCHAR2(32)', nullable: false, position: 1 },
      { name: 'USER_EMAIL', type: 'VARCHAR2(100)', nullable: false, position: 2 },
    ];

    MockRender(TableConstraintForeignKeyComponent, { constraint, affectedColumns });

    const cellTexts = ngMocks.findAll('tbody tr')
      .map(elem => ngMocks.findAll(elem, 'td'))
      .map((elems): string[] => {
        const [, ...elemsWithoutIcon] = elems;
        return elemsWithoutIcon.map(elem => ngMocks.formatText(elem.nativeElement.textContent));
      });

    expect(cellTexts).toEqual([
      ['USER_NAME', 'PK_USER', 'USER', 'NAME'],
      ['USER_EMAIL', 'PK_USER', 'USER', 'EMAIL'],
    ]);
  });
});
