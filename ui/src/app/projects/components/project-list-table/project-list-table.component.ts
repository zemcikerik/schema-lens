import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Project } from '../../models/project.model';
import { MatTableModule } from '@angular/material/table';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-project-list-table',
  templateUrl: './project-list-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatTableModule, MatRipple],
})
export class ProjectListTableComponent {
  readonly DISPLAYED_COLUMNS = ['name', 'dbType', 'owner'];

  projects = input.required<Project[]>();
  selected = output<Project>();
}
