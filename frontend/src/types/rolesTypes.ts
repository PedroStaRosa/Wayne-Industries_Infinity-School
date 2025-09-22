export const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "manager", label: "Gerente" },
  { value: "employee", label: "Funcionário" },
] as const;

export type Role = (typeof ROLES)[number]["value"];
