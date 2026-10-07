import { css } from "@emotion/css";
import { useNavigation } from "react-router-dom";

import { useStyles } from "./PageLoadingBar.styles";

const LOADING_NAVIGATION_STATE = "loading";

export const PageLoadingBar = () => {
  const styles = useStyles();
  const { state } = useNavigation();

  if (state !== LOADING_NAVIGATION_STATE) {
    return null;
  }

  return (
    <div
      className={css(styles.root)}
      role="progressbar"
      aria-label="Загрузка страницы"
    >
      <div className={css(styles.bar)} />
    </div>
  );
};
