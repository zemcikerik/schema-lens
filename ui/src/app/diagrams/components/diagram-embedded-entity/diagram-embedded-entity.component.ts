import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Entity, EntityColumn } from '../../models/entity.model';
import { MatIcon } from '@angular/material/icon';
import { ResizerOffsets } from '../../models/resizer-offsets.model';

const WIDTH_PRIMARY_KEY = 20;
const WIDTH_PER_ROW_LETTER = 9.6;

const HEIGHT_TITLE_SIZE = 20;
const HEIGHT_ROW_SIZE = 24;

const TABLE_BORDER = 1;
const TABLE_PADDING = 8;
const CELL_PADDING = 1;
const CELL_LEFT_PADDING_AFTER_PRIMARY_KEY = 8;
const CELL_LEFT_PADDING_NEXT = 16;

@Component({
  selector: 'app-diagram-embedded-entity',
  templateUrl: './diagram-embedded-entity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
})
export class DiagramEmbeddedEntityComponent {
  entity = input.required<Entity>();
  hasPrimaryKey = computed(() => DiagramEmbeddedEntityComponent.hasPrimaryKey(this.entity()))
  hasNotNullColumn = computed(() => DiagramEmbeddedEntityComponent.hasNotNullColumn(this.entity()));

  static estimateDimensions(entity: Entity): { width: number, height: number } {
    const { columns } = entity;
    const hasPrimaryKey = this.hasPrimaryKey(entity);
    const hasNotNullColumns = this.hasNotNullColumn(entity);

    const nameLength = this.findLongestString(columns, 'name').length;
    const typeLength = this.findLongestString(columns, 'type').length;
    const notNullLength = hasNotNullColumns ? 'NOT NULL'.length : 0;
    const letters = nameLength + typeLength + notNullLength;

    const cellsPerRow = 2 + this.countTrueValues([hasPrimaryKey, hasNotNullColumns]);
    const cellsWithoutPrimaryKey = cellsPerRow - (hasPrimaryKey ? 1 : 0);

    const leftCellPrimaryKeyPadding = hasPrimaryKey ? CELL_LEFT_PADDING_AFTER_PRIMARY_KEY : 0;
    const leftCellPaddings = CELL_PADDING + leftCellPrimaryKeyPadding + (cellsWithoutPrimaryKey - 1) * CELL_LEFT_PADDING_NEXT;
    const rightCellPaddings = cellsPerRow * CELL_PADDING;

    const tableWidthSpacing = 2 * (TABLE_PADDING + TABLE_BORDER) + leftCellPaddings + rightCellPaddings;
    const width = Math.ceil(WIDTH_PER_ROW_LETTER * letters) + (hasPrimaryKey ? WIDTH_PRIMARY_KEY : 0) + tableWidthSpacing;

    const tableHeight = (HEIGHT_ROW_SIZE + 2 * CELL_PADDING) * columns.length + 2 * (TABLE_PADDING + TABLE_BORDER);
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

  private static findLongestString(columns: EntityColumn[], property: 'name' | 'type'): string {
    return columns.reduce(
      (longest, column) => column[property].length > longest.length ? column[property] : longest,
      ''
    );
  }

  private static countTrueValues(values: boolean[]): number {
    return values.reduce((count, value) => count + (value ? 1 : 0), 0);
  }

  private static hasPrimaryKey(entity: Entity): boolean {
    return entity.columns.some(column => column.primaryKey);
  }

  private static hasNotNullColumn(entity: Entity): boolean {
    return entity.columns.some(column => !column.nullable);
  }
}
