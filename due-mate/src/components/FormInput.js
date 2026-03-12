import React from 'react';
import '../styles/FormInput.css';

const FormInput = ({ 
  label, 
  id, 
  type = 'text', 
  error, 
  required, 
  placeholder,
  ...props 
}) => {
  const isTextarea = type === 'textarea';

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      
      {isTextarea ? (
        <textarea
          id={id}
          className={`form-control textarea ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      ) : (
        <input
          type={type}
          id={id}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FormInput;
