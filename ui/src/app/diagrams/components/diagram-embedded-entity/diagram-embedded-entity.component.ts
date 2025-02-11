import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Entity, EntityColumn } from '../../models/entity.model';

const WIDTH_PER_ROW_LETTER = 9.6;

const HEIGHT_TITLE_SIZE = 20;
const HEIGHT_BETWEEN_TITLE_AND_TABLE = 2;
const HEIGHT_ROW_SIZE = 21;

const TABLE_PADDING = 8;
const CELL_PADDING = 1;
const CELL_LEFT_PADDING_NOT_FIRST = 16;

@Component({
  selector: 'app-diagram-embedded-entity',
  templateUrl: './diagram-embedded-entity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramEmbeddedEntityComponent {
  entity = input.required<Entity>();
  hasNotNullColumn = computed(() => DiagramEmbeddedEntityComponent.hasNotNullColumn(this.entity().columns));

  static estimateDimensions(entity: Entity): { width: number, height: number } {
    const { columns } = entity;

    const nameLength = this.findLongestString(columns, 'name').length;
    const typeLength = this.findLongestString(columns, 'type').length;
    const [notNullLength, cellsPerRow] = this.hasNotNullColumn(columns) ? ['NOT NULL'.length, 3] : [0, 2];
    const letters = nameLength + typeLength + notNullLength;
    const tableWidthSpacing = 2 * TABLE_PADDING + cellsPerRow * CELL_PADDING
      + (cellsPerRow - 1) * CELL_LEFT_PADDING_NOT_FIRST + CELL_PADDING;
    const width = Math.ceil(WIDTH_PER_ROW_LETTER * letters) + tableWidthSpacing;

    const tableHeight = (HEIGHT_ROW_SIZE + 2 * CELL_PADDING) * columns.length + 2 * TABLE_PADDING;
    const height = HEIGHT_TITLE_SIZE + HEIGHT_BETWEEN_TITLE_AND_TABLE + tableHeight;

    return { width, height };
  }

  private static findLongestString(columns: EntityColumn[], property: 'name' | 'type'): string {
    return columns.reduce(
      (longest, column) => column[property].length > longest.length ? column[property] : longest,
      ''
    );
  }

  private static hasNotNullColumn(columns: EntityColumn[]): boolean {
    return columns.some(column => !column.nullable);
  }
}
