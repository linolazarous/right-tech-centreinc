import { useCallback, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';

const useFormValidation = (initialValues = {}, config = {}) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [dirtyFields, setDirtyFields] = useState({});

  // Default validation rules
  const defaultRules = {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    password: {
      minLength: 8,
      message: 'Password must be at least 8 characters'
    },
    firstName: {
      minLength: 2,
      maxLength: 50,
      required: true
    }
  };

  // Merge default rules with custom rules from config
  const validationRules = { ...defaultRules, ...config.rules };

  // Debounced validation for real-time feedback
  const debouncedValidate = useCallback(
    debounce((formData, fieldsToValidate) => {
      const newErrors = {};
      let formIsValid = true;

      fieldsToValidate.forEach(field => {
        const value = formData[field]?.trim?.() ?? formData[field];
        const rules = validationRules[field];
        
        if (!rules) return;

        // Check required field
        if (rules.required && !value) {
          newErrors[field] = rules.message || `${field} is required`;
          formIsValid = false;
          return;
        }

        // Check min length
        if (rules.minLength && value?.length < rules.minLength) {
          newErrors[field] = rules.message || 
            `${field} must be at least ${rules.minLength} characters`;
          formIsValid = false;
          return;
        }

        // Check max length
        if (rules.maxLength && value?.length > rules.maxLength) {
          newErrors[field] = rules.message || 
            `${field} must be less than ${rules.maxLength} characters`;
          formIsValid = false;
          return;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
          newErrors[field] = rules.message || `${field} is invalid`;
          formIsValid = false;
          return;
        }

        // Custom validation function
        if (rules.validate && typeof rules.validate === 'function') {
          const customError = rules.validate(value, formData);
          if (customError) {
            newErrors[field] = customError;
            formIsValid = false;
          }
        }
      });

      setErrors(newErrors);
      setIsValid(formIsValid);
    }, 300),
    [validationRules]
  );

  // Async validation function (e.g., for checking unique email)
  const validateAsync = useCallback(async (field, value) => {
    if (!validationRules[field]?.asyncValidate) return null;
    
    try {
      const error = await validationRules[field].asyncValidate(value);
      if (error) {
        setErrors(prev => ({ ...prev, [field]: error }));
        return false;
      }
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (err) {
      console.error('Async validation error:', err);
      return false;
    }
  }, [validationRules]);

  // Mark field as dirty
  const markFieldAsDirty = useCallback((field) => {
    setDirtyFields(prev => ({ ...prev, [field]: true }));
  }, []);

  // Reset form validation
  const resetValidation = useCallback(() => {
    setErrors({});
    setIsValid(false);
    setDirtyFields({});
  }, []);

  // Validate entire form
  const validateForm = useCallback((formData, fieldsToValidate) => {
    debouncedValidate(formData, fieldsToValidate);
    return { isValid, errors };
  }, [debouncedValidate, isValid, errors]);

  // Effect to validate when fields become dirty
  useEffect(() => {
    if (Object.keys(dirtyFields).length > 0) {
      debouncedValidate(initialValues, Object.keys(dirtyFields));
    }
  }, [initialValues, dirtyFields, debouncedValidate]);

  return {
    errors,
    isValid,
    dirtyFields,
    validateForm,
    validateAsync,
    markFieldAsDirty,
    resetValidation,
    debouncedValidate
  };
};

useFormValidation.propTypes = {
  initialValues: PropTypes.object,
  config: PropTypes.shape({
    rules: PropTypes.objectOf(
      PropTypes.shape({
        required: PropTypes.bool,
        minLength: PropTypes.number,
        maxLength: PropTypes.number,
        pattern: PropTypes.instanceOf(RegExp),
        message: PropTypes.string,
        validate: PropTypes.func,
        asyncValidate: PropTypes.func
      })
    )
  })
};

export default useFormValidation;
