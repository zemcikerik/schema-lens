import { ProjectObjectNavService } from './project-object-nav.service';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { TableService } from '../../tables/services/table.service';
import { lastValueFrom, of } from 'rxjs';

describe('ProjectObjectNavService', () => {
  let service: ProjectObjectNavService;
  ngMocks.faster();

  beforeAll(() => MockBuilder(ProjectObjectNavService)
    .mock(TableService));

  beforeEach(() => {
    service = MockRender(ProjectObjectNavService).point.componentInstance;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should include object definition for tables for a given project id', async () => {
    const tableService = ngMocks.get(TableService);
    jest.spyOn(tableService, 'getTableNames').mockReturnValue(of(['MOCK_TABLE_NAME']));

    const mockProjectId = 'fcb2f45e-0668-4e55-bf62-8f7235d6e900';
    const result = service.getObjectDefinitionsFor(mockProjectId);
    const resultDefinition = result.find(d => d.id === 'table');

    expect(resultDefinition).toBeTruthy();
    expect(resultDefinition?.baseRouterLink).toEqual(['/project', mockProjectId, 'table']);
    expect(resultDefinition?.titleTranslationKey).toEqual('TABLES.LIST_LABEL');
    await expect(lastValueFrom(resultDefinition?.objectLoadAction?.() ?? of(null))).resolves.toEqual(['MOCK_TABLE_NAME']);
  });
});
