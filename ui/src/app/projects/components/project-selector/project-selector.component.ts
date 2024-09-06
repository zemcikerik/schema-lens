import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatSelect,
    MatOption,
    MatFormField,
    MatLabel,
  ],
})
export class ProjectSelectorComponent {

  projects: Project[] = [
    { id: 1, name: 'Test Project 1' },
    { id: 2, name: 'Test Project 2' },
  ];

  selectedProject = this.projects[0];
  
}
