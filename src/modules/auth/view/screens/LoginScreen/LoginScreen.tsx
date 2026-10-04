import { css } from "@emotion/css";

import { APP_NAME } from "@/core/constants/app";
import { Card } from "@/core/ui/Card/Card";
import { useLoginForm } from "../../../viewModel/useLoginForm";
import { LoginForm } from "../../components/LoginForm/LoginForm";

import { useStyles } from "./LoginScreen.styles";

export const LoginScreen = () => {
  const styles = useStyles();
  const {
    register,
    errors,
    isSubmitting,
    submitErrorMessage,
    demoCredentials,
    handleLoginSubmit,
  } = useLoginForm();

  return (
    <Card>
      <div className={css(styles.header)}>
        <h1 className={css(styles.title)}>Вход в {APP_NAME}</h1>
        <p className={css(styles.subtitle)}>
          Введите email и пароль, чтобы продолжить.
        </p>
      </div>
      <LoginForm
        register={register}
        errors={errors}
        isSubmitting={isSubmitting}
        submitErrorMessage={submitErrorMessage}
        onSubmit={handleLoginSubmit}
      />
      <p className={css(styles.demoHint)}>
        Демо-доступ: {demoCredentials.email} / {demoCredentials.password}
      </p>
    </Card>
  );
};
