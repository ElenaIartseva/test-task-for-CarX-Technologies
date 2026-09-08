import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  ACCEPTED_FILE_TYPES,
  ALLOWED_FILE_TYPE_LABELS,
  categories,
  MAX_FILES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_TEXT_LENGTH,
  MAX_TOTAL_FILE_SIZE_BYTES,
  MAX_TOTAL_FILE_SIZE_MB
} from '../../utils/constants';
import {
  generateTicketId,
  readFileAsDataUrl,
  StorageQuotaError
} from '../../utils/storage';
import { useNotification } from '../../contexts/NotificationContext';
import { useTickets } from '../../contexts/TicketsContext';
import styles from './Main.module.scss';

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} КБ`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} МБ`;
};

const Main = () => {
  const { showInfo } = useNotification();
  const { addTicket } = useTickets();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [text, setText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedFilesTotalSize = selectedFiles.reduce(
    (totalSize, file) => totalSize + file.size,
    0
  );

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'Другое') {
      setSelectedCategory('Другое');
      setShowCustomInput(true);
    } else {
      setSelectedCategory(value);
      setShowCustomInput(false);
      setCustomCategory('');
    }
  };

  const handleCustomCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_TEXT_LENGTH) {
      setText(e.target.value);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    e.target.value = '';

    if (!newFiles.length) {
      return;
    }

    const filesToAdd = [...selectedFiles];
    let totalSize = selectedFilesTotalSize;

    for (const newFile of newFiles) {
      if (filesToAdd.length >= MAX_FILES) {
        showInfo(`Вы можете прикрепить не более ${MAX_FILES} файлов.`);
        break;
      }

      if (!ACCEPTED_FILE_TYPES.includes(newFile.type)) {
        showInfo(
          `Недопустимый тип файла. Можно прикрепить: ${ALLOWED_FILE_TYPE_LABELS}.`
        );
        continue;
      }

      if (newFile.size > MAX_FILE_SIZE_BYTES) {
        showInfo(
          `Файл слишком большой. Максимальный размер — ${MAX_FILE_SIZE_MB} МБ.`
        );
        continue;
      }

      if (totalSize + newFile.size > MAX_TOTAL_FILE_SIZE_BYTES) {
        showInfo(
          `Общий размер файлов не должен превышать ${MAX_TOTAL_FILE_SIZE_MB} МБ.`
        );
        continue;
      }

      const isDuplicate = filesToAdd.some(file => file.name === newFile.name);
      if (isDuplicate) {
        showInfo('Этот файл уже прикреплён.');
        continue;
      }

      filesToAdd.push(newFile);
      totalSize += newFile.size;
    }

    setSelectedFiles(filesToAdd);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const isSubmitDisabled =
    selectedCategory === 'Другое'
      ? !text.trim() || !customCategory.trim()
      : !text.trim() || !selectedCategory;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitDisabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const fileData = await Promise.all(
        selectedFiles.map(async file => ({
          name: file.name,
          data: await readFileAsDataUrl(file)
        }))
      );

      addTicket({
        id: generateTicketId(),
        category:
          selectedCategory === 'Другое'
            ? customCategory.trim()
            : selectedCategory,
        text: text.trim(),
        files: fileData,
        createdAt: new Date().toLocaleString(),
        status: 'open'
      });

      setSelectedCategory('');
      setCustomCategory('');
      setShowCustomInput(false);
      setText('');
      setSelectedFiles([]);
      showInfo('Обращение успешно отправлено.');
    } catch (error) {
      if (error instanceof StorageQuotaError) {
        showInfo(
          `${error.message} Удалите старые обращения или прикрепите файлы меньшего размера.`
        );
      } else {
        showInfo('Не удалось прикрепить файлы. Попробуйте ещё раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h3 className={styles.title}>Создать новое обращение</h3>
        <form
          action='#'
          name='form-ticket'
          className={styles.form}
          noValidate
          onSubmit={handleSubmit}
        >
          <div className={styles.category}>
            <label className={styles.label}>
              <span className={styles.description}>Тема обращения</span>
              <select
                id='input-category'
                className={styles.input}
                value={selectedCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value='' disabled hidden>
                  Выберите тему обращения
                </option>
                {categories.map(category => (
                  <option
                    className={styles.option}
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </label>
            {showCustomInput && (
              <label className={styles.label}>
                <span className={styles.description}>Своя тема</span>
                <input
                  type='text'
                  value={customCategory}
                  onChange={handleCustomCategoryChange}
                  className={styles.input}
                  placeholder='Введите тему вручную'
                  required
                />
              </label>
            )}
          </div>
          <label className={styles.label}>
            <span className={styles.description}>Текст обращения</span>
            <textarea
              id='input-text'
              name='text'
              autoComplete='off'
              value={text}
              onChange={handleInputChange}
              className={styles.textarea}
              placeholder='Текст до 1 000 символов'
              rows={4}
              maxLength={MAX_TEXT_LENGTH}
              aria-describedby='ticket-text-counter'
              required
            />
            <span className={styles.counter} id='ticket-text-counter'>
              {text.length} / {MAX_TEXT_LENGTH}
            </span>
          </label>
          <label className={styles.label}>
            <span className={styles.description}>
              Прикрепить файлы (до 5 штук, до {MAX_FILE_SIZE_MB} МБ каждый)
            </span>
            <span className={styles.helperText}>
              Допустимые типы: {ALLOWED_FILE_TYPE_LABELS}. Общий размер: до{' '}
              {MAX_TOTAL_FILE_SIZE_MB} МБ.
            </span>
            <input
              className={styles.files}
              type='file'
              accept={ACCEPTED_FILE_TYPES}
              multiple
              onChange={handleFileChange}
            />
            <span className={styles.helperText}>
              Выбрано файлов: {selectedFiles.length} / {MAX_FILES}, общий
              размер: {formatFileSize(selectedFilesTotalSize)}
            </span>
            {selectedFiles.map((file, index) => (
              <div className={styles.file} key={`${file.name}-${index}`}>
                <span>
                  {file.name} ({formatFileSize(file.size)})
                </span>
                <button
                  type='button'
                  className={styles.removeFileBtn}
                  onClick={() => handleRemoveFile(index)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </label>
          <button
            name='button'
            type='submit'
            disabled={isSubmitDisabled || isSubmitting}
            className={styles.btn}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Main;
