import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.titleNumber}>404</h1>
      <h2 className={styles.titleText}>Страница не найдена...</h2>
      <Link className={styles.link} to='/'>
        <span className={styles.linkText}>вернуться на главную страницу</span>
      </Link>
    </div>
  );
};

export default NotFound;
