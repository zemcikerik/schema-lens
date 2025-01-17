import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../core/translate/translate.pipe';

const PROJECT_ID_REGEX = /^\/project\/([a-z-\d]{36})/;

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatFormField,
    MatLabel,
    TranslatePipe,
  ],
})
export class ProjectSelectorComponent implements AfterViewInit {
  projects = inject(ProjectService).projects;
  private location = inject(Location);
  private router = inject(Router);

  selectControl = new FormControl<string | null>(null);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => this.updateProjectSelection());
  }

  ngAfterViewInit(): void {
    this.updateProjectSelection();
  }

  async onSelectionChange(projectId: string): Promise<void> {
    await this.router.navigate(['/project', projectId]);
  }

  private updateProjectSelection(): void {
    const url = this.location.path(false);
    const matches = PROJECT_ID_REGEX.exec(url);
    this.selectControl.setValue(matches?.[1] ?? null);
  }
}
