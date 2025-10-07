import { type FormEvent, useMemo, useState } from 'react';
import { HttpError } from '../../../lib/api/httpClient';
import {
  hasFieldErrors,
  normalizeEmail,
  validateEmail,
  validatePassword,
} from '../utils/validation';
import { AuthFormField } from './AuthFormField';
import { useAuth } from '../hooks/useAuth';

type FormField = 'email' | 'password';

type FormValues = Record<FormField, string>;

type FieldErrors = Record<FormField, string | null>;

const INITIAL_VALUES: FormValues = {
  email: '',
  password: '',
};

const INITIAL_TOUCHED_STATE: Record<FormField, boolean> = {
  email: false,
  password: false,
};

const FIELD_IDS = {
  email: 'login-email',
  password: 'login-password',
} satisfies Record<FormField, string>;

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [touched, setTouched] = useState<Record<FormField, boolean>>(
    INITIAL_TOUCHED_STATE,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawErrors = useMemo<FieldErrors>(
    () => ({
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    }),
    [values.email, values.password],
  );

  const visibleErrors: FieldErrors = {
    email: touched.email ? rawErrors.email : null,
    password: touched.password ? rawErrors.password : null,
  };
  const hasBlockingErrors = hasFieldErrors(rawErrors);

  const handleBlur = (field: FormField) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: FormField) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (hasBlockingErrors) {
      setSubmitError(
        'Please resolve the highlighted issues before continuing.',
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await login({
        email: normalizeEmail(values.email),
        password: values.password,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        setSubmitError(error.message || 'Unable to sign in.');
      } else if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Unable to sign in. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <header className="space-y-4 text-base-content">
        <span className="badge badge-outline badge-primary uppercase tracking-[0.4em] text-xs">
          Welcome back
        </span>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Sign in</h1>
        <p className="text-sm text-base-content/70 md:text-base">
          Enter your credentials to continue syncing your videos across every
          device.
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
          error={visibleErrors.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
          required
        />

        <AuthFormField
          id={FIELD_IDS.password}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="********"
          value={values.password}
          error={visibleErrors.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
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
          className="btn btn-primary btn-block"
          disabled={isSubmitting || hasBlockingErrors}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="text-center text-sm text-base-content/70">
          Don&apos;t have an account yet?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="btn btn-link px-0 text-primary"
          >
            Create one
          </button>
        </p>
      </div>
    </form>
  );
}
