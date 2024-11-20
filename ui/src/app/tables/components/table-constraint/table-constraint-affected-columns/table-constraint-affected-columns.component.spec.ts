import { TableConstraintAffectedColumnsComponent } from './table-constraint-affected-columns.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';
import { signal } from '@angular/core';
import { TableColumn } from '../../../models/table-column.model';

describe('TableConstraintAffectedColumnsComponent', () => {
  ngMocks.faster();

  beforeAll(() => MockBuilder(TableConstraintAffectedColumnsComponent)
    .mock(TranslatePipe, v => signal(v)));

  it('should be created', () => {
    const fixture = MockRender(TableConstraintAffectedColumnsComponent, { columns: [] });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render row containing icon and name for each column', () => {
    const columns: TableColumn[] = [
      { name: 'ID', type: 'NUMBER(4,2)', nullable: false, position: 1 },
      { name: 'NAME', type: 'VARCHAR2(50)', nullable: true, position: 2 },
    ];

    MockRender(TableConstraintAffectedColumnsComponent, { columns });

    const cells = ngMocks.findAll('tr')
      .map((elem): HTMLTableRowElement => elem.nativeElement)
      .map(row => Array.from(row.children));

    expect(cells).toHaveLength(2);
    expect(cells[0]).toHaveLength(2);
    expect(cells[1]).toHaveLength(2);
    expect(ngMocks.input(ngMocks.find('tr:first-child td:first-child > *'), 'type')).toEqual('NUMBER(4,2)');
    expect(ngMocks.formatText(cells[0][1].textContent ?? '')).toEqual('ID');
    expect(ngMocks.input(ngMocks.find('tr:last-child td:first-child > *'), 'type')).toEqual('VARCHAR2(50)');
    expect(ngMocks.formatText(cells[1][1].textContent ?? '')).toEqual('NAME');
  });
});
