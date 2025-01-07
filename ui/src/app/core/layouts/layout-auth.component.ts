import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-layout-auth',
  templateUrl: './layout-auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AlertComponent,
    MatProgressBar,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
})
export class LayoutAuthComponent {
  title = input.required<string>();
  loading = input<boolean>(false);
  error = input<string | null>(null);
}
