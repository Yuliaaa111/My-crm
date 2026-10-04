import { DEMO_CREDENTIALS } from "./constants";
import type { MockUserType } from "./types";

export const MOCK_USERS: MockUserType[] = [
  {
    id: "user-1",
    name: "Анна Демидова",
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
  },
];
