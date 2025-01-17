import { ChangeDetectionStrategy, Component, effect, input, output, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { OracleConnectionProperties, ProjectProperties } from '../../models/project-properties.model';
import { DbType } from '../../../core/models/db-type';
import { ipAddressValidator } from '../../../core/validators/ip-address.validator';
import { FormatGenericValidationErrorsPipe } from '../../../shared/pipes/format-generic-validation-errors.pipe';
import { portValidator } from '../../../core/validators/port.validator';
import { ProjectCollaborationRole } from '../../models/project-collaboration-role.model';
import { noStartEndWhitespaceValidator } from '../../../core/validators/no-start-end-whitespace.validator';

@Component({
  selector: 'app-project-properties-form',
  templateUrl: './project-properties-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButton,
    MatIcon,
    MatInput,
    MatOption,
    MatSelect,
    TranslatePipe,
    FormatGenericValidationErrorsPipe,
  ],
})
export class ProjectPropertiesFormComponent {
  properties = input<ProjectProperties | null>(null);
  saveAllowed = input<boolean>(true);
  deleteAllowed = input<boolean>(true);
  save = output<ProjectProperties>();
  delete = output();

  propertiesForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, noStartEndWhitespaceValidator, Validators.maxLength(64)]),
    dbType: new FormControl<DbType | null>(null, [Validators.required]),
    oracleConnection: new FormGroup({
      host: new FormControl<string>('', [Validators.required, ipAddressValidator]),
      port: new FormControl<number | null>(null, [Validators.required, portValidator]),
      service: new FormControl<string>('', [Validators.required, Validators.maxLength(128)]),
      username: new FormControl<string>('', [Validators.required, Validators.maxLength(128)]),
      password: new FormControl<string>('', [Validators.required, Validators.maxLength(128)]),
    }),
  });

  constructor() {
    effect(() => {
      const properties = this.properties();

      untracked(() => {
        this.propertiesForm.reset();

        if (properties === null) {
          this.connectionPasswordControl.addValidators(Validators.required);
          return;
        }

        this.connectionPasswordControl.removeValidators(Validators.required);
        this.propertiesForm.patchValue({
          name: properties.name,
          dbType: properties.dbType,
          oracleConnection: { ...properties.connection },
        });
      });
    });

    effect(() => {
      const saveAllowed = this.saveAllowed();
      untracked(() => this.propertiesForm[saveAllowed ? 'enable' : 'disable']())
    });
  }

  submit(): void {
    if (this.propertiesForm.valid) {
      const { name, dbType, oracleConnection } = this.propertiesForm.value;

      this.save.emit({
        id: this.properties()?.id ?? null,
        name: name as string,
        dbType: dbType as DbType,
        owner: '',
        currentUserRole: ProjectCollaborationRole.OWNER,
        connection: oracleConnection as OracleConnectionProperties,
      });
    }
  }

  get nameControl() {
    return this.propertiesForm.controls.name;
  }

  get dbTypeControl() {
    return this.propertiesForm.controls.dbType;
  }

  get connectionHostControl() {
    return this.propertiesForm.controls.oracleConnection.controls.host;
  }

  get connectionPortControl() {
    return this.propertiesForm.controls.oracleConnection.controls.port;
  }

  get connectionUsernameControl() {
    return this.propertiesForm.controls.oracleConnection.controls.username;
  }

  get connectionPasswordControl() {
    return this.propertiesForm.controls.oracleConnection.controls.password;
  }

  get connectionServiceControl() {
    return this.propertiesForm.controls.oracleConnection.controls.service;
  }
}
