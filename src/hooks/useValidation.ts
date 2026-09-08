import { useState, useCallback, type ChangeEvent } from 'react';
import type { LoginFormErrors, LoginFormValues } from '../types';

export function useValidation() {
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isValid, setIsValid] = useState(false);
  const [formValue, setFormValue] = useState<LoginFormValues>({
    login: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const { value, name, validationMessage } = input;

    setFormValue(prev => ({
      ...prev,
      [name]: value
    }));

    let errorMessage = validationMessage;

    if (
      (name === 'login' || name === 'password') &&
      validationMessage === 'Введите данные в указанном формате.'
    ) {
      errorMessage =
        name === 'login'
          ? 'Логин должен состоять из не менее чем 5 символов.'
          : 'Пароль должен состоять из не менее чем 5 символов.';
    }

    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));

    setIsValid(input.closest('form')?.checkValidity() ?? false);
  };

  const resetForm = useCallback(
    (
      newValue: LoginFormValues = { login: '', password: '' },
      newErrorMessage: LoginFormErrors = {},
      newIsValid = false
    ) => {
      setFormValue(newValue);
      setErrors(newErrorMessage);
      setIsValid(newIsValid);
    },
    []
  );

  return {
    formValue,
    handleChange,
    resetForm,
    errors,
    isValid
  };
}

export default useValidation;
