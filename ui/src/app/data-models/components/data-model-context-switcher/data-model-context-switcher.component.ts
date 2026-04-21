import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { DataModelingContext, DataModelingContextState } from '../../data-modeling-context.state';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-model-context-switcher',
  template: `
    <mat-form-field class="w-100" appearance="outline" subscriptSizing="dynamic">
      <mat-label>{{ ('DATA_MODEL.CONTEXT.SWITCHER_LABEL' | translate)() }}</mat-label>
      <mat-select required [value]="contextState.context()" (selectionChange)="onContextChange($event.value)">
        <mat-option value="logical">{{ ('DATA_MODEL.CONTEXT.LOGICAL' | translate)() }}</mat-option>
        <mat-option value="oracle">{{ ('DATA_MODEL.CONTEXT.ORACLE' | translate)() }}</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    TranslatePipe,
  ],
})
export class DataModelContextSwitcherComponent {
  contextState = inject(DataModelingContextState);

  async onContextChange(context: DataModelingContext): Promise<void> {
    await this.contextState.switchToContext(context);
  }
}
