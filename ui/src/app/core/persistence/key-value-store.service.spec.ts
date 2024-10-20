import { KeyValueStoreService } from './key-value-store.service';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { LOCAL_STORAGE } from './local-storage.token';
import { InMemoryStorage } from './in-memory.storage';

describe('KeyValueStoreService', () => {
  let service: KeyValueStoreService;
  let storage: Storage;
  ngMocks.faster();

  beforeAll(() => MockBuilder(KeyValueStoreService)
    .mock(LOCAL_STORAGE, new InMemoryStorage()));

  beforeEach(() => {
    service = MockRender(KeyValueStoreService).point.componentInstance;
    storage = ngMocks.get(LOCAL_STORAGE);
  });

  afterEach(() => {
    storage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('string', () => {
    it('should hold string values', () => {
      service.setString('key', 'value');
      expect(service.getStringOrDefault('key', 'default')).toEqual('value');
    });

    it('should return default value if key has no value', () => {
      expect(service.getStringOrDefault('key', 'default')).toEqual('default');
    });
  });
});
