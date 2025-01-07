import { inject, Pipe, PipeTransform, signal, Signal } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateService } from '../../core/translate/translate.service';

@Pipe({
  name: 'formatGenericValidationErrors',
  standalone: true,
  pure: true,
})
export class FormatGenericValidationErrorsPipe implements PipeTransform {

  private translateService = inject(TranslateService);

  transform(errors: ValidationErrors | null): Signal<string | null> {
    if (errors == null) {
      return signal(null);
    }

    if (errors['required']) {
      return this.translateService.translate('GENERIC.VALIDATION.REQUIRED');
    }
    if (errors['minlength']) {
      return this.translateService.translate(
        'GENERIC.VALIDATION.MIN_LENGTH',
        { minLength: errors['minlength'].requiredLength }
      );
    }
    if (errors['maxlength']) {
      return this.translateService.translate(
        'GENERIC.VALIDATION.MAX_LENGTH',
        { maxLength: errors['maxlength'].requiredLength }
      );
    }
    if (errors['pattern']) {
      return this.translateService.translate('GENERIC.VALIDATION.PATTERN');
    }
    if (errors['ipAddress']) {
      return this.translateService.translate(
        errors['ipAddress'] === 'invalid'
          ? 'GENERIC.VALIDATION.IP_ADDRESS.INVALID'
          : 'GENERIC.VALIDATION.IP_ADDRESS.ILLEGAL'
      );
    }
    if (errors['port']) {
      return this.translateService.translate('GENERIC.VALIDATION.PORT');
    }

    return this.translateService.translate('GENERIC.VALIDATION.UNKNOWN');
  }

}
