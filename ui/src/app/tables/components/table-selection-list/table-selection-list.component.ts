import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-table-selection-list',
  templateUrl: './table-selection-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSelectionList,
    MatListOption,
    FormsModule,
    TranslatePipe,
  ],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TableSelectionListComponent), multi: true },
  ]
})
export class TableSelectionListComponent implements ControlValueAccessor {
  tableNames = input.required<string[]>();
  selectedTableNames: string[] = [];

  disabled = signal<boolean>(false);
  private onChange: (value: string[]) => void = () => void 0;
  private onTouched = (): void => void 0;

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  writeValue(value: string[]): void {
    const tableNames = this.tableNames();
    this.selectedTableNames = value.filter(table => tableNames.includes(table));
  }

  onSelectionChange(value: string[]): void {
    this.onChange(value);
    this.onInteraction();
  }

  onInteraction(): void {
    this.onTouched();
  }
}
