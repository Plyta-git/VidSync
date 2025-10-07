import { type FormEvent, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { HttpError } from '../../../lib/api/httpClient';
import {
  hasFieldErrors,
  normalizeEmail,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  MIN_PASSWORD_LENGTH,
} from '../utils/validation';
import { AuthFormField } from './AuthFormField';

type FormField = 'email' | 'password' | 'confirmPassword';

type FormValues = Record<FormField, string>;

type FieldErrors = Record<FormField, string | null>;

const INITIAL_VALUES: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

const INITIAL_TOUCHED_STATE: Record<FormField, boolean> = {
  email: false,
  password: false,
  confirmPassword: false,
};

const FIELD_IDS = {
  email: 'register-email',
  password: 'register-password',
  confirmPassword: 'register-confirm-password',
} satisfies Record<FormField, string>;

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Record<FormField, boolean>>(
    INITIAL_TOUCHED_STATE,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationErrors = useMemo<FieldErrors>(() => {
    return {
      email: validateEmail(values.email),
      password: validatePassword(values.password, {
        minLength: MIN_PASSWORD_LENGTH,
      }),
      confirmPassword: validatePasswordConfirmation(
        values.confirmPassword,
        values.password,
      ),
    };
  }, [values.confirmPassword, values.email, values.password]);

  const hasValidationErrors = hasFieldErrors(validationErrors);

  const emailError = touched.email ? validationErrors.email : null;
  const passwordError = touched.password ? validationErrors.password : null;
  const confirmPasswordError = touched.confirmPassword
    ? validationErrors.confirmPassword
    : null;

  const handleFieldBlur = (field: FormField) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFieldChange = (field: FormField) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });

    if (hasValidationErrors) {
      setSubmitError(
        'Please resolve the highlighted issues before continuing.',
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await registerUser({
        email: normalizeEmail(values.email),
        password: values.password,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        setSubmitError(error.message || 'Unable to sign up.');
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Unable to sign up. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <header className="space-y-4 text-base-content">
        <span className="badge badge-outline badge-secondary uppercase tracking-[0.4em] text-xs">
          Create account
        </span>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Sign up
        </h1>
        <p className="text-sm text-base-content/70 md:text-base">
          Join VidSync to collaborate with your team, share edits, and keep
          everything aligned in real time.
        </p>
      </header>

      <div className="space-y-4">
        <AuthFormField
          id={FIELD_IDS.email}
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          error={emailError}
          onChange={handleFieldChange('email')}
          onBlur={handleFieldBlur('email')}
          required
        />

        <AuthFormField
          id={FIELD_IDS.password}
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={values.password}
          error={passwordError}
          onChange={handleFieldChange('password')}
          onBlur={handleFieldBlur('password')}
          required
        />

        <AuthFormField
          id={FIELD_IDS.confirmPassword}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          error={confirmPasswordError}
          onChange={handleFieldChange('confirmPassword')}
          onBlur={handleFieldBlur('confirmPassword')}
          required
        />
      </div>

      {submitError ? (
        <div role="alert" className="alert alert-error">
          <span>{submitError}</span>
        </div>
      ) : null}

      <div className="space-y-3">
        <button
          type="submit"
          className="btn btn-secondary btn-block"
          disabled={isSubmitting || hasValidationErrors}
        >
          {isSubmitting ? 'Signing up...' : 'Create account'}
        </button>

        <p className="text-center text-sm text-base-content/70">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="btn btn-link px-0 text-secondary"
          >
            Sign in instead
          </button>
        </p>
      </div>
    </form>
  );
}
