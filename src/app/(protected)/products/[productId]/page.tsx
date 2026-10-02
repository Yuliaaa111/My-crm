import { Card } from "@/core/ui/Card/Card";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";

export const Page = () => (
  <Card>
    <EmptyState
      title="Карточка товара"
      description="Данные товара появятся на этапе 4."
    />
  </Card>
);
