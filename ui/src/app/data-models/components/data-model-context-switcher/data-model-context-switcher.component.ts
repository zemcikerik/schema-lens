import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { DataModelingContext, DataModelingContextState } from '../../data-modeling-context.state';

@Component({
  selector: 'app-data-model-context-switcher',
  template: `
    <mat-form-field class="w-100" appearance="outline" subscriptSizing="dynamic">
      <mat-label>Modeling Layer</mat-label>
      <mat-select required [value]="contextState.context()" (selectionChange)="onContextChange($event.value)">
        <mat-option value="logical">Logical</mat-option>
        <mat-option value="oracle">Physical (Oracle)</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
  ],
})
export class DataModelContextSwitcherComponent {
  contextState = inject(DataModelingContextState);

  async onContextChange(context: DataModelingContext): Promise<void> {
    await this.contextState.switchToContext(context);
  }
}
