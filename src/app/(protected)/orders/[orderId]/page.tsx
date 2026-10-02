import { Card } from "@/core/ui/Card/Card";
import { EmptyState } from "@/core/ui/EmptyState/EmptyState";

export const Page = () => (
  <Card>
    <EmptyState
      title="Заказ"
      description="Детали заказа появятся на этапе 5."
    />
  </Card>
);
