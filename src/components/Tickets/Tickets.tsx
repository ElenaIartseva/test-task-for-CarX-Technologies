import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MAX_TEXT_LENGTH } from '../../utils/constants';
import { useNotification } from '../../contexts/NotificationContext';
import { useTickets } from '../../contexts/TicketsContext';
import { generateStorageId } from '../../utils/storage';
import styles from './Tickets.module.scss';

const Tickets = () => {
  const { id } = useParams();
  const ticketId = Number(id);
  const { showConfirm } = useNotification();
  const { getTicketById, getCommentsByTicketId, addComment, updateTicket } =
    useTickets();
  const [textComment, setTextComment] = useState('');
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const selectedTicket = Number.isNaN(ticketId)
    ? null
    : getTicketById(ticketId);
  const ticketComments = selectedTicket ? getCommentsByTicketId(ticketId) : [];
  const isTicketClosed = selectedTicket?.status === 'closed';

  if (Number.isNaN(ticketId)) {
    return <Navigate to='/404' replace />;
  }

  if (!selectedTicket) {
    return <Navigate to='/404' replace />;
  }

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (textComment.trim() === '' || isTicketClosed) {
      return;
    }

    addComment({
      id: generateStorageId(),
      text: textComment.trim(),
      date: new Date().toLocaleString(),
      ticketId
    });

    setTextComment('');
    setIsInputEmpty(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_TEXT_LENGTH) {
      setTextComment(e.target.value);
      setIsInputEmpty(e.target.value.trim() === '');
    }
  };

  const handleBlockRequest = () => {
    updateTicket({ ...selectedTicket, status: 'closed' });
  };

  const handleCloseRequest = (e: FormEvent) => {
    e.preventDefault();
    showConfirm(
      'После закрытия обращения добавление новых комментариев невозможно.',
      handleBlockRequest
    );
  };

  return (
    <section className={styles.tickets}>
      <div className={styles.container}>
        <h3 className={styles.title}>
          Информация об обращении: {selectedTicket.id}
        </h3>

        <div className={styles.mainContainer}>
          <p className={styles.text}>
            <span className={styles.textTitle}>Тема:</span>
            {selectedTicket.category}
          </p>
          <p className={styles.text}>
            <span className={styles.textTitle}>Дата создания:</span>
            {selectedTicket.createdAt}
          </p>
          <p className={styles.text}>
            <span className={styles.textTitle}>Статус:</span>
            {selectedTicket.status === 'open' ? 'Открыт' : 'Закрыт'}
          </p>
          <p className={styles.text}>
            <span className={styles.textTitle}>Текст:</span>
            {selectedTicket.text}
          </p>
        </div>

        {isTicketClosed ? (
          <p className={styles.blockDescription}>
            Обращение закрыто для редактирования
          </p>
        ) : (
          <form className={styles.addContainer} noValidate>
            <label className={styles.label}>
              <span className={styles.description}>Добавить комментарий</span>
              <textarea
                id='input-text'
                name='text'
                value={textComment}
                onChange={handleInputChange}
                autoComplete='off'
                className={styles.textarea}
                placeholder='Текст до 1 000 символов'
                rows={3}
                maxLength={MAX_TEXT_LENGTH}
                aria-describedby='comment-text-counter'
                required
              />
              <span className={styles.counter} id='comment-text-counter'>
                {textComment.length} / {MAX_TEXT_LENGTH}
              </span>
            </label>
            <div className={styles.buttons}>
              <button
                name='button'
                type='submit'
                disabled={isInputEmpty}
                onClick={handleAddComment}
                className={styles.btn}
              >
                Добавить комментарий
              </button>
              <button
                name='button'
                type='button'
                onClick={handleCloseRequest}
                className={styles.btn}
              >
                Закрыть обращение
              </button>
            </div>
          </form>
        )}
      </div>

      <div className={styles.container}>
        <h3 className={styles.title}>Список комментариев</h3>
        {ticketComments.length ? (
          <ul className={styles.commentList}>
            {ticketComments.map(comment => (
              <li
                key={comment.id ?? comment.date}
                className={styles.commentItem}
              >
                <p>{comment.text}</p>
                <p className={styles.commentItemDate}>{comment.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Комментариев пока нет.</p>
        )}
      </div>

      <div className={styles.container}>
        <h3 className={styles.title}>Прикреплённые файлы</h3>
        {selectedTicket.files?.length ? (
          <ul className={styles.fileList}>
            {selectedTicket.files.map((file, index) => (
              <li key={`${file.name}-${index}`} className={styles.fileItem}>
                {file.data ? (
                  <a
                    href={file.data}
                    download={file.name}
                    className={styles.fileLink}
                  >
                    {file.name}
                  </a>
                ) : (
                  file.name
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Файлы не прикреплены.</p>
        )}
      </div>

      <Link className={styles.link} to='/'>
        <span className={styles.linkText}>вернуться на главную страницу</span>
      </Link>
    </section>
  );
};

export default Tickets;
