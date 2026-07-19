import PropTypes from 'prop-types'

/**
 * Accessible labeled input/textarea with inline error text. Single
 * definition so every Contact form field shares focus/error styling
 * (component_rules.md: reusable, accessible, no duplicated code).
 */
function FormField({
  as = 'input',
  id,
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  rows = 5,
  autoComplete,
  placeholder,
}) {
  const fieldClasses = `w-full rounded-md border bg-surface/60 px-4 py-3 text-sm text-text placeholder:text-muted
    transition-colors duration-200 focus:outline-none
    ${error ? 'border-primary' : 'border-border-strong focus:border-secondary'}`

  const Field = as === 'textarea' ? 'textarea' : 'input'

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      <Field
        id={id}
        name={name}
        {...(as === 'textarea' ? { rows } : { type })}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClasses}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-primary">
          {error}
        </p>
      )}
    </div>
  )
}

FormField.propTypes = {
  as: PropTypes.oneOf(['input', 'textarea']),
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  rows: PropTypes.number,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
}

export default FormField
