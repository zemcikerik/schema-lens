import { SidebarStateService } from './sidebar-state.service';

describe('SidebarStateService', () => {
  let service: SidebarStateService;

  beforeEach(() => {
    service = new SidebarStateService();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isOpen', () => {
    it('should default to false', () => {
      expect(service.isOpen()).toEqual(false);
    });

    it('should be true when open is called', () => {
      service.open();
      expect(service.isOpen()).toEqual(true);
    });

    it('should be false when close is called after open', () => {
      service.open();
      service.close();
      expect(service.isOpen()).toEqual(false);
    });
  });

  describe('hasSidebar', () => {
    it('should default to false', () => {
      expect(service.hasSidebar()).toBe(false);
    });

    it('should be true after registerSidebar is called', () => {
      service.registerSidebar();
      expect(service.hasSidebar()).toBe(true);
    });

    it('should be false after unregisterSidebar() is called', () => {
      service.registerSidebar();
      service.unregisterSidebar();
      expect(service.hasSidebar()).toBe(false);
    });
  });
});
