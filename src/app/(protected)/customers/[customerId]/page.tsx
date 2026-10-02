import { Card } from "@/core/ui/Card/Card";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";

export const Page = () => (
  <Card>
    <EmptyState
      title="Карточка клиента"
      description="Данные клиента появятся на этапе 3."
    />
  </Card>
);
