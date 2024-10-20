import { InMemoryStorage } from './in-memory.storage';

describe('InMemoryStorage', () => {
  let storage: InMemoryStorage;

  beforeEach(() => {
    storage = new InMemoryStorage();
  });

  it('should be created', () => {
    expect(storage).toBeTruthy();
  });

  it('should return null for unknown value', () => {
    expect(storage.getItem('unknown')).toBeNull();
  });

  it('should store and retrieve values', () => {
    expect(storage.length).toEqual(0);

    storage.setItem('key', 'value');

    expect(storage.length).toEqual(1);
    expect(storage.getItem('key')).toEqual('value');
  });

  it('should remove value', () => {
    storage.setItem('key', 'valueToBeRemoved');
    expect(storage.length).toEqual(1);

    storage.removeItem('key');

    expect(storage.length).toEqual(0);
    expect(storage.getItem('key')).toBeNull();
  });

  it('should retrieve key by index', () => {
    storage.setItem('key', 'value');

    expect(storage.key(0)).toEqual('key');
    expect(storage.key(1)).toBeNull();
  });

  it('should clear all values', () => {
    storage.setItem('key1', 'val');
    storage.setItem('key2', 'val');
    expect(storage.length).toEqual(2);

    storage.clear();

    expect(storage.length).toEqual(0);
    expect(storage.getItem('key1')).toBeNull();
    expect(storage.getItem('key2')).toBeNull();
  });
});
