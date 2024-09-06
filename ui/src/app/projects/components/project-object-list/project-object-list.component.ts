import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatListItem, MatNavList } from '@angular/material/list';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

@Component({
  selector: 'app-project-object-list',
  templateUrl: './project-object-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatNavList,
    MatListItem,
    TranslatePipe,
  ],
})
export class ProjectObjectListComponent {
}
