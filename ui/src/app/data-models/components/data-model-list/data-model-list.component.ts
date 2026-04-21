import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentCardComponent } from '../../../shared/components/content-card/content-card.component';
import { MatAnchor, MatButton } from '@angular/material/button';
import { DataModelListTableComponent } from '../data-model-list-table/data-model-list-table.component';
import { DataModel } from '../../models/data-model.model';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { IconEmphasisDirective } from '../../../shared/directives/icon-emphasis.directive';
import { DataModelService } from '../../services/data-model.service';
import { LayoutHeaderAndContentComponent } from '../../../core/layouts/layout-header-and-content.component';

@Component({
  selector: 'app-data-model-list',
  templateUrl: './data-model-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContentCardComponent,
    DataModelListTableComponent,
    MatIcon,
    AlertComponent,
    TranslatePipe,
    IconEmphasisDirective,
    MatAnchor,
    RouterLink,
    LayoutHeaderAndContentComponent,
    MatButton,
  ],
})
export class DataModelListComponent {
  dataModels = inject(DataModelService).dataModels;
  private router = inject(Router);

  async openDataModel(dataModel: DataModel): Promise<void> {
    await this.router.navigate(['/model', dataModel.id]);
  }
}
