export class InMemoryStorage implements Storage {

  private items: Partial<Record<string, string>> = {};

  get length(): number {
    return Object.keys(this.items).length;
  }

  clear(): void {
    this.items = {};
  }

  getItem(key: string): string | null {
    return this.items[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.items)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.items[key];
  }

  setItem(key: string, value: string): void {
    this.items[key] = value;
  }

}
