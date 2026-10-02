import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/core/constants/routes";
import { Button } from "@/core/ui/Button/Button";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      title="Страница не найдена"
      description="Такого адреса нет. Проверьте ссылку или вернитесь на главную."
      action={
        <Button onClick={() => navigate(ROUTES.dashboard)}>На главную</Button>
      }
    />
  );
};
