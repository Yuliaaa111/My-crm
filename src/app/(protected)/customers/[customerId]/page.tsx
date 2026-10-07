import { CustomerDetailsScreen } from "@/modules/customers/public";
import { CustomerOrdersSection } from "@/modules/orders/public";

export const Page = () => (
  <CustomerDetailsScreen
    renderRelatedSections={(customerId) => (
      <CustomerOrdersSection customerId={customerId} />
    )}
  />
);
