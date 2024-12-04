import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import ipaddr from 'ipaddr.js';

type IpAddress = ipaddr.IPv4 | ipaddr.IPv6;

export const validateIpAddress: ValidatorFn = (control: AbstractControl<string>): ValidationErrors | null => {
  const ipAddress = parseIpAddress(control.value);

  if (ipAddress === null) {
    return null;
  } else if (ipAddress === undefined) {
    return { ipAddress: 'invalid' };
  }

  return ['unspecified', 'multicast', 'linkLocal', 'loopback', 'private'].includes(ipAddress.range()) ? { ipAddress: 'illegal' } : null;
};

const parseIpAddress = (value: string | null | undefined): IpAddress | null | undefined => {
  if (!value) {
    return null;
  }

  const isValid = ipaddr.IPv4.isValidFourPartDecimal(value) || ipaddr.IPv6.isValid(value);
  return isValid ? ipaddr.parse(value) : undefined;
};
