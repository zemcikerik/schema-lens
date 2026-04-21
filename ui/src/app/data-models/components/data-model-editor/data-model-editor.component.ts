import { Observable } from 'rxjs';
import { DataModelModification } from '../../models/data-model.model';
import { UntypedFormGroup } from '@angular/forms';

export interface DataModelEditor {
  readonly form: UntypedFormGroup;
  save(): Observable<DataModelModification> | null;
}
