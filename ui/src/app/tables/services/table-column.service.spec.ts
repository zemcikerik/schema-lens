import { TableColumnService } from './table-column.service';

describe('TableColumnService', () => {
  let service: TableColumnService;

  beforeEach(() => {
    service = new TableColumnService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.todo('should return primary key columns for provided table');
});
