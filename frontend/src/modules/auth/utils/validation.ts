const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export function normalizeEmail(value: string): string {
  return value.trim();
}

export function validateEmail(value: string): string | null {
  const email = normalizeEmail(value);

  if (!email) {
    return 'Email is required.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Email address is invalid.';
  }

  return null;
}

export interface PasswordValidationOptions {
  minLength?: number;
}

export function validatePassword(
  value: string,
  options: PasswordValidationOptions = {},
): string | null {
  const password = value.trim();

  if (!password) {
    return 'Password is required.';
  }

  const minLength = options.minLength ?? MIN_PASSWORD_LENGTH;

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters.`;
  }

  return null;
}

export function validatePasswordConfirmation(
  confirmation: string,
  password: string,
): string | null {
  const isConfirmationEmpty = confirmation.trim().length === 0;

  if (isConfirmationEmpty) {
    return 'Confirm your password.';
  }

  if (confirmation !== password) {
    return 'Passwords do not match.';
  }

  return null;
}

export function hasFieldErrors(record: Record<string, string | null>): boolean {
  return Object.values(record).some(Boolean);
}
