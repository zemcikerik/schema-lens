import type { ModuleDeclaration } from 'didi';
import { RelationshipLayouter } from './relationship.layouter';
import { RelationshipRenderer } from './relationship.renderer';

export const RelationshipModule = {
  __init__: ['layouter', 'relationshipRenderer'],
  layouter: ['type', RelationshipLayouter],
  relationshipRenderer: ['type', RelationshipRenderer],
} satisfies ModuleDeclaration;
