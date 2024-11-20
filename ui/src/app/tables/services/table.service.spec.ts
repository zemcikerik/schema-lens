import { TableService } from './table.service';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TableHttpClientService } from './table-http-client.service';
import { lastValueFrom, of, Subject } from 'rxjs';
import { Table } from '../models/table.model';

describe('TableService', () => {
  let service: TableService;
  let tableHttpClient: TableHttpClientService;
  ngMocks.faster();

  beforeAll(() => MockBuilder(TableService)
    .mock(TableHttpClientService));

  beforeEach(() => {
    service = MockRender(TableService).point.componentInstance;
    tableHttpClient = ngMocks.get(TableHttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve table names for project', async () => {
    const mockProjectId = '7bf87eab-187d-425d-9fe7-7bdd5c5237a5';
    jest.spyOn(tableHttpClient, 'getTableNames').mockReturnValue(of(['MOCK_RESULT']));

    const result$ = service.getTableNames(mockProjectId);

    await expect(lastValueFrom(result$)).resolves.toEqual(['MOCK_RESULT']);
    expect(tableHttpClient.getTableNames).toHaveBeenCalledWith(mockProjectId);
  });

  it('should retrieve table details', async () => {
    const projectId = 'f8290080-ab18-4850-b969-a47796651f89';
    const tableName = 'MOCK_TABLE';
    const mockTable: Table = {
      name: 'MOCK_TABLE',
      columns: [],
      constraints: [],
    };
    jest.spyOn(tableHttpClient, 'getTable').mockReturnValue(of(mockTable));

    const result$ = service.getTableDetails(projectId, tableName);

    await expect(lastValueFrom(result$)).resolves.toEqual(mockTable);
    expect(tableHttpClient.getTable).toHaveBeenCalledWith(projectId, tableName);
  });

  it('should cache table detail calls', async () => {
    const projectId = '64f99f26-f6b0-4e0a-a8e0-b53be34d6769';
    const tableName = 'CACHED_TABLE';
    const mockTable: Table = {
      name: 'CACHED_TABLE',
      columns: [],
      constraints: [],
    };
    const table$ = new Subject<Table | null>();
    jest.spyOn(tableHttpClient, 'getTable').mockReturnValue(table$.asObservable());

    const firstResultPromise = lastValueFrom(service.getTableDetails(projectId, tableName));
    const secondResultPromise = lastValueFrom(service.getTableDetails(projectId, tableName));

    table$.next(mockTable);
    table$.complete();

    await expect(firstResultPromise).resolves.toEqual(mockTable);
    await expect(secondResultPromise).resolves.toEqual(mockTable);
    expect(tableHttpClient.getTable).toHaveBeenCalledTimes(1);
  });
});
