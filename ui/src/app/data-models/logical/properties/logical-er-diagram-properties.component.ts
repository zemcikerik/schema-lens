import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-logical-er-diagram-properties',
  templateUrl: './logical-er-diagram-properties.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
  ],
})
export class LogicalErDiagramPropertiesComponent {

}
