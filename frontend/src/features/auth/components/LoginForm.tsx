import { type FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { HttpError } from '../../../lib/http/client';

function validateEmail(value: string) {
  const pattern = /.+@.+\..+/;
  return pattern.test(value);
}

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setFormError('Wpisz adres e-mail i haslo.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setFormError('Adres e-mail ma nieprawidlowy format.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await login({ email: trimmedEmail, password: trimmedPassword });
    } catch (error) {
      if (error instanceof HttpError) {
        setFormError(error.message || 'Nie udalo sie zalogowac.');
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError('Nie udalo sie zalogowac. Sprobuj ponownie pozniej.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-6 rounded-lg bg-base-100 p-8 shadow-lg"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-base-content">
          Zaloguj sie
        </h1>
        <p className="text-sm text-base-content/70">
          Uzyskaj dostep do swojego profilu i projektow.
        </p>
      </div>

      <label className="form-control">
        <div className="label">
          <span className="label-text">Adres e-mail</span>
        </div>
        <input
          type="email"
          autoComplete="email"
          className="input input-bordered"
          placeholder="jan.kowalski@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="form-control">
        <div className="label">
          <span className="label-text">Haslo</span>
        </div>
        <input
          type="password"
          autoComplete="current-password"
          className="input input-bordered"
          placeholder="********"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {formError ? (
        <div className="alert alert-error text-sm">
          <span>{formError}</span>
        </div>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logowanie...' : 'Zaloguj sie'}
      </button>
    </form>
  );
}
