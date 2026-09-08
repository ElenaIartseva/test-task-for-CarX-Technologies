import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoPopup from './InfoPopup';

describe('InfoPopup', () => {
  test('does not render when closed', () => {
    render(
      <InfoPopup
        title='Test'
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders alert variant with OK button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <InfoPopup
        title='Сообщение'
        isOpen={true}
        variant='alert'
        onClose={onClose}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Сообщение')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^ок$/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders confirm variant with two actions', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <InfoPopup
        title='Подтверждение'
        isOpen={true}
        variant='confirm'
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    const dialog = screen.getByRole('dialog');

    await user.click(
      within(dialog).getByRole('button', { name: /вернуться назад/i })
    );
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole('button', { name: /^закрыть обращение$/i })
    );
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('keeps keyboard focus inside the dialog and closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <InfoPopup
        title='Подтверждение'
        isOpen={true}
        variant='confirm'
        onClose={onClose}
        onConfirm={vi.fn()}
      />
    );

    const dialog = screen.getByRole('dialog');
    const cancelButton = within(dialog).getByRole('button', {
      name: /вернуться назад/i
    });
    const confirmButton = within(dialog).getByRole('button', {
      name: /^закрыть обращение$/i
    });

    expect(cancelButton).toHaveFocus();

    await user.tab();
    expect(confirmButton).toHaveFocus();

    await user.tab();
    expect(cancelButton).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
