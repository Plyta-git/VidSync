import type { InputHTMLAttributes } from 'react';

interface AuthFormFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'id' | 'className'
  > {
  id: string;
  label: string;
  value: string;
  error?: string | null;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export function AuthFormField({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  className = '',
  inputClassName = '',
  ...rest
}: AuthFormFieldProps) {
  const showError = Boolean(error);
  const errorId = `${id}-error`;

  return (
    <div className={`form-control w-full ${className}`.trim()}>
      <label className="label" htmlFor={id}>
        <span className="label-text uppercase text-xs font-semibold tracking-[0.35em] text-base-content/70">
          {label}
        </span>
      </label>

      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className={`input input-bordered w-full ${
          showError ? 'input-error' : ''
        } ${inputClassName}`.trim()}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
        {...rest}
      />

      <label className="label">
        <span
          id={errorId}
          className={`label-text-alt ${
            showError ? 'text-error' : 'text-base-content/60'
          }`.trim()}
          aria-live="polite"
          aria-hidden={!showError}
        >
          {showError ? error : ' '}
        </span>
      </label>
    </div>
  );
}
