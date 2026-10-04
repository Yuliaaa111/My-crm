import { css } from "@emotion/css";
import type { FormEventHandler } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Button } from "@/core/ui/Button/Button";
import { FormField } from "@/core/ui/FormField/FormField";
import { Input } from "@/core/ui/Input/Input";
import type { AuthRequest } from "../../../model/types";

import { useStyles } from "./LoginForm.styles";

const EMAIL_FIELD_ID = "login-email";
const PASSWORD_FIELD_ID = "login-password";

type LoginFormProps = {
  register: UseFormRegister<AuthRequest>;
  errors: FieldErrors<AuthRequest>;
  isSubmitting: boolean;
  submitErrorMessage: string | null;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const LoginForm = ({
  register,
  errors,
  isSubmitting,
  submitErrorMessage,
  onSubmit,
}: LoginFormProps) => {
  const styles = useStyles();

  return (
    <form className={css(styles.root)} onSubmit={onSubmit} noValidate>
      <FormField
        label="Email"
        fieldId={EMAIL_FIELD_ID}
        errorMessage={errors.email?.message}
      >
        <Input
          id={EMAIL_FIELD_ID}
          type="email"
          autoComplete="username"
          placeholder="name@company.ru"
          hasError={Boolean(errors.email)}
          {...register("email")}
        />
      </FormField>
      <FormField
        label="Пароль"
        fieldId={PASSWORD_FIELD_ID}
        errorMessage={errors.password?.message}
      >
        <Input
          id={PASSWORD_FIELD_ID}
          type="password"
          autoComplete="current-password"
          hasError={Boolean(errors.password)}
          {...register("password")}
        />
      </FormField>
      {submitErrorMessage ? (
        <p className={css(styles.submitError)} role="alert">
          {submitErrorMessage}
        </p>
      ) : null}
      <Button type="submit" isDisabled={isSubmitting}>
        {isSubmitting ? "Входим…" : "Войти"}
      </Button>
    </form>
  );
};
