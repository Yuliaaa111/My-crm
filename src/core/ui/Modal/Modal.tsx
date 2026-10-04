import { css } from "@emotion/css";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useId } from "react";
import { createPortal } from "react-dom";

import { ICON_SIZE } from "@/core/constants/layout";
import { IconButton } from "@/core/ui/IconButton/IconButton";

import { useStyles } from "./Modal.styles";

const CLOSE_KEY = "Escape";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ title, onClose, children }: ModalProps) => {
  const styles = useStyles();
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === CLOSE_KEY) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className={css(styles.overlay)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={css(styles.dialog)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={css(styles.header)}>
          <h2 id={titleId} className={css(styles.title)}>
            {title}
          </h2>
          <IconButton label="Закрыть" onClick={onClose}>
            <X size={ICON_SIZE} />
          </IconButton>
        </div>
        <div className={css(styles.body)}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};
