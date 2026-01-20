import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { IconEmphasisDirective } from '../../../shared/directives/icon-emphasis.directive';
import { SchemaDiagramNode } from '../model/schema-diagram-node.model';
import { SchemaDiagramField } from '../model/schema-diagram-field.model';
import { ResizerOffsets } from './resizer-offsets.model';
import { SchemaDiagramEdge } from '../model/schema-diagram-edge.model';

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
  selector: 'app-schema-diagram-node',
  templateUrl: './schema-diagram-node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatTooltip, TranslatePipe, IconEmphasisDirective],
})
export class SchemaDiagramNodeComponent {
  node = input.required<SchemaDiagramNode>();
  highlightEdgeIds = input<number[]>([]);

  hasKey = computed(() => SchemaDiagramNodeComponent.hasPrimaryKey(this.node()))
  hasNotNullField = computed(() => SchemaDiagramNodeComponent.hasNotNullField(this.node()));

  formatUniqueGroupText(index: number, count: number): string {
    return count === 1 ? 'U' : `U${index + 1}`;
  }

  isReferencedInEdge(edge: SchemaDiagramEdge, fieldName: string): boolean {
    return edge.references.some(ref => ref.toFieldName === fieldName);
  }

  static estimateDimensions(node: SchemaDiagramNode): { width: number, height: number } {
    const { fields, uniqueFieldGroups } = node;
    const edgeCount = node.parentEdges.length;

    const hasKey = this.hasPrimaryKey(node);
    const hasNotNullFields = this.hasNotNullField(node);

    const nameLength = this.findLongestString(fields, 'name').length;
    const typeLength = this.findLongestString(fields, 'type').length;
    const notNullLength = hasNotNullFields ? 'NN'.length : 0;
    const uniqueLength = this.calculateUniqueGroupsLetterCount(uniqueFieldGroups);
    const letters = nameLength + typeLength + notNullLength + uniqueLength;

    const cellsPerRow = 2 + this.countTrueValues([hasKey, hasNotNullFields]) + uniqueFieldGroups.length + edgeCount;
    const cellsWithoutKeys = cellsPerRow - (hasKey ? 1 : 0) - edgeCount;

    const leftCellPrimaryKeyPadding = hasKey ? CELL_LEFT_PADDING_AFTER_PRIMARY_KEY : 0;
    const leftCellReferencePadding = this.calculateReferencePadding(edgeCount);
    const leftCellPaddings = CELL_PADDING + leftCellPrimaryKeyPadding + leftCellReferencePadding + (cellsWithoutKeys - 1) * CELL_LEFT_PADDING_NEXT;
    const rightCellPaddings = cellsPerRow * CELL_PADDING;

    const tableWidthSpacing = 2 * (TABLE_PADDING + TABLE_BORDER) + leftCellPaddings + rightCellPaddings;
    const width = Math.ceil(WIDTH_PER_ROW_LETTER * letters)
      + ((hasKey ? 1 : 0) + edgeCount) * WIDTH_KEY
      + tableWidthSpacing;

    const tableHeight = (HEIGHT_ROW_SIZE + 2 * CELL_PADDING) * fields.length + 2 * (TABLE_PADDING + TABLE_BORDER);
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

  private static calculateReferencePadding(edgeCount: number): number {
    return edgeCount > 0
      ? CELL_LEFT_PADDING_REFERENCE * (edgeCount - 1) + CELL_LEFT_PADDING_REFERENCE_START
      : 0;
  }

  private static findLongestString(fields: SchemaDiagramField[], property: 'name' | 'type'): string {
    return fields.reduce((longest, attribute) =>
      attribute[property].length > longest.length ? attribute[property] : longest, '');
  }

  private static countTrueValues(values: boolean[]): number {
    return values.reduce((count, value) => count + (value ? 1 : 0), 0);
  }

  private static hasPrimaryKey(node: SchemaDiagramNode): boolean {
    return node.fields.some(field => field.key);
  }

  private static hasNotNullField(node: SchemaDiagramNode): boolean {
    return node.fields.some(field => !field.nullable);
  }
}
