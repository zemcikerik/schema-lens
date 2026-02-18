import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DataModel } from '../../models/data-model.model';
import { MatTableModule } from '@angular/material/table';
import { MatRipple } from '@angular/material/core';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-data-model-list-table',
  templateUrl: './data-model-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatRipple, TranslatePipe],
})
export class DataModelListTableComponent {
  readonly DISPLAYED_COLUMNS = ['name'];

  dataModels = input.required<DataModel[]>();
  selected = output<DataModel>();
}
