import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Entity } from '../../models/entity.model';

@Component({
  selector: 'app-diagram-embedded-entity',
  templateUrl: './diagram-embedded-entity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramEmbeddedEntityComponent {
  entity = input.required<Entity>();

  static estimateDimensions(entity: Entity): { width: number, height: number } {
    // todo: implement + height 100%
    return { width: 356, height: 200 };
  }
}
