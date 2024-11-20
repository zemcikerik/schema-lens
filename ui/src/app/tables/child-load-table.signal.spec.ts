import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { childLoadTableSignal } from './child-load-table.signal';
import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { TableService } from './services/table.service';
import { Table } from './models/table.model';
import { of, Subject, throwError } from 'rxjs';

describe('childLoadTableSignal', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => MockBuilder(ChildLoadTableSignalHostComponent)
    .mock(TableService, {
      getTableDetails: () => of({} as Table)
    }));

  it('should let host be rendered successfully', () => {
    const projectId = 'b2396f03-1c22-4fc1-b88c-3a0e659f312f';
    const tableName = 'TEST_TABLE';

    const fixture = MockRender(ChildLoadTableSignalHostComponent, { projectId, tableName });
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should load table data using table service', () => {
    const projectId = 'c2a38429-bc27-4265-a5ef-74362c0941f6';
    const tableName = 'TEST_TABLE';

    const mockTable = { tableName } as unknown as Table;
    const result$ = new Subject<Table | null>();
    MockInstance(TableService, 'getTableDetails', jest.fn(() => result$.asObservable()));

    const fixture = MockRender(ChildLoadTableSignalHostComponent, { projectId, tableName });

    const resultSignal = fixture.point.componentInstance.table;
    expect(resultSignal()).toBeNull();
    expect(ngMocks.get(TableService).getTableDetails).toHaveBeenCalledWith(projectId, tableName);

    result$.next(mockTable);
    expect(resultSignal()).toEqual(mockTable);
  });

  it('should update table data when input signal changes', () => {
    MockInstance(TableService, 'getTableDetails', (projectId: string, tableName: string) =>
      of({ name: `${projectId}:${tableName}` } as Table));

    const fixture = MockRender(ChildLoadTableSignalHostComponent, {
      projectId: '2430c834-b90b-45da-afd6-68294072f47a',
      tableName: 'FIRST_TABLE',
    });

    const resultSignal = fixture.point.componentInstance.table;
    expect(resultSignal()?.name).toEqual('2430c834-b90b-45da-afd6-68294072f47a:FIRST_TABLE');

    fixture.componentInstance.projectId = 'b6e27df1-17f7-4baa-93d9-9bfb68be2e3f';
    fixture.componentInstance.tableName = 'SECOND_TABLE';
    fixture.detectChanges();
    expect(resultSignal()?.name).toEqual('b6e27df1-17f7-4baa-93d9-9bfb68be2e3f:SECOND_TABLE');
  });

  it('should ignore table retrieval errors', () => {
    MockInstance(TableService, 'getTableDetails', () => throwError(() => new Error()));

    const fixture = MockRender(ChildLoadTableSignalHostComponent, {
      projectId: 'a3d6574a-4877-4c89-9d9f-f881f300e427',
      tableName: 'ERROR_TABLE',
    });

    expect(fixture.point.componentInstance.table()).toBeNull();
  });

  @Component({
    selector: 'app-child-table-signal-host',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
  })
  class ChildLoadTableSignalHostComponent {
    projectId = input.required<string>();
    tableName = input.required<string>();
    table = childLoadTableSignal(this.projectId, this.tableName);
  }
});
