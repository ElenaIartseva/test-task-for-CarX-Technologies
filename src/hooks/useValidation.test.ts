import type { ChangeEvent } from 'react';
import { renderHook, act } from '@testing-library/react';
import useValidation from './useValidation';

const createChangeEvent = ({
  name,
  value,
  validationMessage,
  isValid
}: {
  name: string;
  value: string;
  validationMessage: string;
  isValid: boolean;
}): ChangeEvent<HTMLInputElement> =>
  ({
    target: {
      name,
      value,
      validationMessage,
      closest: () => ({
        checkValidity: () => isValid
      })
    }
  }) as unknown as ChangeEvent<HTMLInputElement>;

describe('useValidation', () => {
  test('updates form values on change', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      result.current.handleChange(
        createChangeEvent({
          name: 'login',
          value: 'admin',
          validationMessage: '',
          isValid: true
        })
      );
    });

    expect(result.current.formValue.login).toBe('admin');
    expect(result.current.isValid).toBe(true);
  });

  test('shows custom error for short login', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      result.current.handleChange(
        createChangeEvent({
          name: 'login',
          value: 'abc',
          validationMessage: 'Введите данные в указанном формате.',
          isValid: false
        })
      );
    });

    expect(result.current.errors.login).toBe(
      'Логин должен состоять из не менее чем 5 символов.'
    );
  });

  test('resetForm clears state', () => {
    const { result } = renderHook(() => useValidation());

    act(() => {
      result.current.handleChange(
        createChangeEvent({
          name: 'password',
          value: 'admin',
          validationMessage: '',
          isValid: true
        })
      );
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formValue).toEqual({ login: '', password: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(false);
  });
});
