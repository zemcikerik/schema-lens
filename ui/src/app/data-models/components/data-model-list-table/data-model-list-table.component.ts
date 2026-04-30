import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { DataModel } from '../../models/data-model.model';
import { MatTableModule } from '@angular/material/table';
import { MatRipple } from '@angular/material/core';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { ProfilePictureComponent } from '../../../shared/components/profile-picture/profile-picture.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-data-model-list-table',
  templateUrl: './data-model-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatRipple, TranslatePipe, ProfilePictureComponent],
})
export class DataModelListTableComponent {
  readonly DISPLAYED_COLUMNS = ['name', 'owner'];

  dataModels = input.required<DataModel[]>();
  selected = output<DataModel>();

  currentUser = inject(AuthService).currentUser;
}
