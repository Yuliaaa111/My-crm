import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { useSessionStore } from "@/core/stores/sessionStore";
import { getErrorMessage } from "@/core/utils/getErrorMessage";
import { login } from "../model/authApi";
import { DEMO_CREDENTIALS, loginFormDefaultValues } from "../model/constants";
import { loginSchema } from "../model/schema";
import type { AuthRequest } from "../model/types";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const startSession = useSessionStore((state) => state.startSession);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginFormDefaultValues,
  });

  const submitCredentials = async (credentials: AuthRequest): Promise<void> => {
    setSubmitErrorMessage(null);

    try {
      startSession(await login(credentials));
      navigate(ROUTES.dashboard, { replace: true });
    } catch (error) {
      setSubmitErrorMessage(getErrorMessage(error));
    }
  };

  return {
    register,
    errors,
    isSubmitting,
    submitErrorMessage,
    demoCredentials: DEMO_CREDENTIALS,
    handleLoginSubmit: handleSubmit(submitCredentials),
  };
};
