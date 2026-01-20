import type { ModuleDeclaration } from 'didi';
import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';

export const CroppingConnectionDockingModule = {
  connectionDocking: ['type', CroppingConnectionDocking],
} satisfies ModuleDeclaration;
