import { css } from "@emotion/css";

import { Button } from "@/core/ui/Button/Button";
import { Modal } from "@/core/ui/Modal/Modal";

import { useStyles } from "./ConfirmDialog.styles";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  isConfirming: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  title,
  message,
  confirmLabel,
  isConfirming,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const styles = useStyles();

  return (
    <Modal title={title} onClose={onCancel}>
      <p className={css(styles.message)}>{message}</p>
      {errorMessage ? (
        <p className={css(styles.error)} role="alert">
          {errorMessage}
        </p>
      ) : null}
      <div className={css(styles.actions)}>
        <Button
          variant="secondary"
          onClick={onCancel}
          isDisabled={isConfirming}
        >
          Отмена
        </Button>
        <Button variant="danger" onClick={onConfirm} isDisabled={isConfirming}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
