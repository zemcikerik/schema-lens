import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '../../../../core/translate/translate.pipe';
import { CodeEditorComponent } from '../../../../shared/components/code-editor/code-editor.component';
import { ProgressSpinnerComponent } from '../../../../shared/components/progress-spinner/progress-spinner.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, finalize, map, of, tap } from 'rxjs';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { TableColumnService } from '../../../services/table-column.service';
import { escapeHtml } from '../../../../core/escape-html.fn';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { TranslateService } from '../../../../core/translate/translate.service';
import {
  ProjectConnectionErrorAlertComponent
} from '../../../../projects/components/project-connection-error-alert/project-connection-error-alert.component';

export interface SetUnusedColumnDialogData {
  projectId: string;
  tableName: string;
  columnName: string;
}

@Component({
  selector: 'app-table-column-set-unused-dialog',
  templateUrl: './table-column-set-unused-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatCheckbox,
    TranslatePipe,
    CodeEditorComponent,
    ProgressSpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    AlertComponent,
    SafeHtmlPipe,
    ProjectConnectionErrorAlertComponent,
  ],
})
export class TableColumnSetUnusedDialogComponent {

  targetData = inject<SetUnusedColumnDialogData>(MAT_DIALOG_DATA);
  private destroyRef = inject(DestroyRef);
  private matDialogRef = inject(MatDialogRef);
  private tableColumnService = inject(TableColumnService);
  private translateService = inject(TranslateService);

  statusResource = rxResource({
    loader: () => {
      const { projectId, tableName, columnName } = this.targetData;
      return this.tableColumnService.getColumnUnusedAvailability(projectId, tableName, columnName);
    },
  });

  referencedByTablesList = computed(() =>
    this.joinIntoUnorderedListOfEscapedHtml(this.statusResource.value()?.referencedByTables),
  );
  usedInMultiColumnConstraintsList = computed(() =>
    this.joinIntoUnorderedListOfEscapedHtml(this.statusResource.value()?.usedInMultiColumnConstraints),
  );

  optionsForm = new FormGroup({
    cascadeConstraints: new FormControl(false),
  });

  previewSqlDebounce = signal<boolean>(false);
  previewSqlResource = rxResource({
    loader: () => {
      const status = this.statusResource.value();
      const { cascadeConstraints } = this.optionsForm.value;

      if (!status) {
        return of('');
      }

      if (!cascadeConstraints && status.cascadeConstraintsRequired) {
        return of(this.translateService.translate('TABLES.COLUMNS.SET_UNUSED.DIALOG.INVALID_OPTIONS_COMMENT')());
      }

      const { projectId, tableName, columnName } = this.targetData;
      return this.tableColumnService.previewSqlForSetColumnUnused(projectId, {
        tableName, columnName, cascadeConstraints: !!cascadeConstraints
      });
    },
  });

  modificationRunning = signal<boolean>(false);
  modificationError = signal<boolean>(false);

  constructor() {
    effect(() => {
      const status = this.statusResource.value();

      if (status) {
        if (status.cascadeConstraintsRequired) {
          this.optionsForm.controls.cascadeConstraints.addValidators(Validators.requiredTrue);
        }

        this.previewSqlResource.reload();
      }
    });

    this.optionsForm.valueChanges.pipe(
      map(value => ({ cascadeConstraints: !!value.cascadeConstraints })),
      tap(() => this.previewSqlDebounce.set(true)),
      debounceTime(1000),
      tap(() => this.previewSqlDebounce.set(false)),
      distinctUntilChanged((prev, curr) => prev.cascadeConstraints === curr.cascadeConstraints),
      takeUntilDestroyed(),
    ).subscribe(() => this.previewSqlResource.reload());
  }

  setUnused(): void {
    if (this.statusResource.isLoading() || this.optionsForm.invalid || this.modificationRunning()) {
      return;
    }

    const { projectId, tableName, columnName } = this.targetData;
    const { cascadeConstraints } = this.optionsForm.value;
    this.modificationRunning.set(true);
    this.matDialogRef.disableClose = true;

    this.tableColumnService.setColumnUnused(projectId, {
      tableName, columnName, cascadeConstraints: !!cascadeConstraints,
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.modificationRunning.set(false);
        this.matDialogRef.disableClose = false;
      }),
    ).subscribe({
      next: () => this.matDialogRef.close(true),
      error: () => this.modificationError.set(true),
    });
  }

  private joinIntoUnorderedListOfEscapedHtml(values: string[] | null | undefined): string {
    if (!values) {
      return '';
    }

    const items = values.map(value => `<li>${escapeHtml(value)}</li>`).join('');
    return `<ul>${items}</ul>`;
  }

}
