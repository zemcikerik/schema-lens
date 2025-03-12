import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Entity, EntityAttribute } from './entity.model';
import { MatIcon } from '@angular/material/icon';
import { ResizerOffsets } from './resizer-offsets.model';
import { Relationship } from '../relationship/relationship.model';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

const WIDTH_KEY = 20;
const WIDTH_PER_ROW_LETTER = 9.6;

const HEIGHT_TITLE_SIZE = 20;
const HEIGHT_ROW_SIZE = 24;

const TABLE_BORDER = 1;
const TABLE_PADDING = 8;
const CELL_PADDING = 1;
const CELL_LEFT_PADDING_AFTER_PRIMARY_KEY = 8;
const CELL_LEFT_PADDING_NEXT = 16;
const CELL_LEFT_PADDING_REFERENCE = 4;
const CELL_LEFT_PADDING_REFERENCE_START = 8;

@Component({
  selector: 'app-embedded-entity',
  templateUrl: './entity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip, TranslatePipe],
})
export class EntityComponent {
  entity = input.required<Entity>();
  relationshipsToDirectParents = input<Relationship[]>([]);
  hasPrimaryKey = computed(() => EntityComponent.hasPrimaryKey(this.entity()))
  hasNotNullAttribute = computed(() => EntityComponent.hasNotNullAttribute(this.entity()));

  formatUniqueGroupText(index: number, count: number): string {
    return count === 1 ? 'U' : `U${index + 1}`;
  }

  isReferencedInRelationship(relationship: Relationship, attributeName: string): boolean {
    return relationship.references.some(ref => ref.childAttributeName === attributeName);
  }

  static estimateDimensions(entity: Entity, relationshipsToDirectParents: Relationship[]): { width: number, height: number } {
    const { attributes, uniqueGroups } = entity;
    const hasPrimaryKey = this.hasPrimaryKey(entity);
    const hasNotNullAttributes = this.hasNotNullAttribute(entity);

    const nameLength = this.findLongestString(attributes, 'name').length;
    const typeLength = this.findLongestString(attributes, 'type').length;
    const notNullLength = hasNotNullAttributes ? 'NN'.length : 0;
    const uniqueLength = this.calculateUniqueGroupsLetterCount(uniqueGroups);
    const letters = nameLength + typeLength + notNullLength + uniqueLength;

    const cellsPerRow = 2 + this.countTrueValues([hasPrimaryKey, hasNotNullAttributes]) + uniqueGroups.length + relationshipsToDirectParents.length;
    const cellsWithoutKeys = cellsPerRow - (hasPrimaryKey ? 1 : 0) - relationshipsToDirectParents.length;

    const leftCellPrimaryKeyPadding = hasPrimaryKey ? CELL_LEFT_PADDING_AFTER_PRIMARY_KEY : 0;
    const leftCellReferencePadding = this.calculateReferencePadding(relationshipsToDirectParents);
    const leftCellPaddings = CELL_PADDING + leftCellPrimaryKeyPadding + leftCellReferencePadding + (cellsWithoutKeys - 1) * CELL_LEFT_PADDING_NEXT;
    const rightCellPaddings = cellsPerRow * CELL_PADDING;

    const tableWidthSpacing = 2 * (TABLE_PADDING + TABLE_BORDER) + leftCellPaddings + rightCellPaddings;
    const width = Math.ceil(WIDTH_PER_ROW_LETTER * letters)
      + ((hasPrimaryKey ? 1 : 0) + relationshipsToDirectParents.length) * WIDTH_KEY
      + tableWidthSpacing;

    const tableHeight = (HEIGHT_ROW_SIZE + 2 * CELL_PADDING) * attributes.length + 2 * (TABLE_PADDING + TABLE_BORDER);
    const height = HEIGHT_TITLE_SIZE + tableHeight;

    return { width, height };
  }

  static calculateResizerHandleOffsets({ width, height }: { width: number, height: number }): ResizerOffsets {
    const horizontalMiddle = width / 2;
    const verticalMiddle = (height - HEIGHT_TITLE_SIZE) / 2 + HEIGHT_TITLE_SIZE;

    return {
      top: { x: horizontalMiddle, y: HEIGHT_TITLE_SIZE },
      right: { x: width, y: verticalMiddle },
      bottom: { x: horizontalMiddle, y: height },
      left: { x: 0, y: verticalMiddle },
      topLeft: { x: 0, y: HEIGHT_TITLE_SIZE },
      topRight: { x: width, y: HEIGHT_TITLE_SIZE },
      bottomLeft: { x: 0, y: height },
      bottomRight: { x: width, y: height },
    };
  }

  private static calculateUniqueGroupsLetterCount(uniqueGroups: string[][]): number {
    if (uniqueGroups.length <= 1) {
      return uniqueGroups.length;
    }

    return uniqueGroups
      .map((_, index) => 'U'.length + String(index + 1).length)
      .reduce((acc, length) => acc + length, 0);
  }

  private static calculateReferencePadding(relationshipsToDirectParents: Relationship[]): number {
    if (relationshipsToDirectParents.length < 1) {
      return 0;
    }
    return CELL_LEFT_PADDING_REFERENCE * (relationshipsToDirectParents.length - 1) + CELL_LEFT_PADDING_REFERENCE_START;
  }

  private static findLongestString(attributes: EntityAttribute[], property: 'name' | 'type'): string {
    return attributes.reduce((longest, attribute) =>
      attribute[property].length > longest.length ? attribute[property] : longest, '');
  }

  private static countTrueValues(values: boolean[]): number {
    return values.reduce((count, value) => count + (value ? 1 : 0), 0);
  }

  private static hasPrimaryKey(entity: Entity): boolean {
    return entity.attributes.some(attribute => attribute.primaryKey);
  }

  private static hasNotNullAttribute(entity: Entity): boolean {
    return entity.attributes.some(attribute => !attribute.nullable);
  }
}
