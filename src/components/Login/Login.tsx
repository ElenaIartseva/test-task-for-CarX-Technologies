import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useValidation from '../../hooks/useValidation';
import { DEMO_CREDENTIALS } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import eyeOpen from '../../images/icons/eye-open.png';
import eyeClose from '../../images/icons/eye-close.png';
import styles from './Login.module.scss';

const Login = () => {
  const { login } = useAuth();
  const { showInfo } = useNotification();
  const { errors, isValid, handleChange, resetForm, formValue } =
    useValidation();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const enteredLogin = formValue.login.trim();
    const enteredPassword = formValue.password;

    if (
      enteredLogin === DEMO_CREDENTIALS.login &&
      enteredPassword === DEMO_CREDENTIALS.password
    ) {
      login(enteredLogin);
      navigate('/');
    } else {
      showInfo('Что-то пошло не так! Попробуйте ещё раз.');
    }
  };

  return (
    <section className={styles.login}>
      <div className={styles.container}>
        <h3 className={styles.title}>Вход в личный кабинет</h3>
        <form
          action='#'
          name='form-login'
          className={styles.form}
          noValidate
          onSubmit={handleSubmit}
        >
          <label className={styles.label}>
            <span className={styles.description}>Логин</span>
            <input
              id='input-login'
              type='text'
              name='login'
              className={styles.input}
              placeholder='Введите логин'
              required
              autoComplete='username'
              pattern='.{5,}'
              title='Логин должен состоять из не менее чем 5 символов.'
              value={formValue.login}
              onChange={handleChange}
              aria-invalid={Boolean(errors.login)}
              aria-describedby='login-error'
            />
            <span
              className={`${!isValid && errors.login ? styles.inputError : ''}`}
              id='login-error'
              role='alert'
            >
              {errors.login || ''}
            </span>
          </label>
          <label className={styles.label}>
            <span className={styles.description}>Пароль</span>
            <div className={styles.passwordField}>
              <input
                id='input-password'
                name='password'
                className={`${styles.input} ${styles.passwordInput}`}
                placeholder='Введите пароль'
                type={passwordVisible ? 'text' : 'password'}
                required
                autoComplete='current-password'
                pattern='.{5,}'
                title='Пароль должен состоять из не менее чем 5 символов.'
                value={formValue.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                aria-describedby='password-error'
              />
              <button
                type='button'
                className={styles.passwordVisibilityBtn}
                onClick={togglePasswordVisibility}
                aria-label={
                  passwordVisible ? 'Скрыть пароль' : 'Показать пароль'
                }
              >
                <img
                  className={styles.img}
                  src={passwordVisible ? eyeOpen : eyeClose}
                  alt=''
                />
              </button>
            </div>
            <span
              className={`${
                !isValid && errors.password ? styles.inputError : ''
              }`}
              id='password-error'
              role='alert'
            >
              {errors.password || ''}
            </span>
          </label>
          <button
            name='button'
            type='submit'
            disabled={!isValid}
            className={styles.btn}
          >
            Войти
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
