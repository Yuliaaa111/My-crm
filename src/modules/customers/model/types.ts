export type CustomerStatusType = "active" | "inactive";

export type CustomerStatusFilterType = CustomerStatusType | "all";

export type CustomerType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  country: string;
  status: CustomerStatusType;
  createdAt: string;
};

export type CustomerViewType = CustomerType & {
  fullName: string;
  location: string;
  createdAtLabel: string;
};

export type CustomerRequest = Omit<CustomerType, "id" | "createdAt">;

export type CustomerResponse = CustomerType;

export type CustomersListResponse = CustomerType[];
