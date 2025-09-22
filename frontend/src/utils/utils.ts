import type { Role } from "../types/rolesTypes";
import type UserResponseProps from "../types/userResponseType";

function parseUsers(users: UserResponseProps[]) {
  return users.map((user) => ({
    ...user,
    created_at: new Date(user.created_at),
    updated_at: new Date(user.created_at), // converte para Date
  }));
}

type DateFormatType = "reduced" | "full";

function formatDate(date: Date, typeDate: DateFormatType): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (typeDate === "full") {
    options.hour = "2-digit";
    options.minute = "2-digit";
    /* options.second = "2-digit"; */
  }

  return date.toLocaleString("pt-BR", options);
}

const canEdit = (role: Role) => {
  return ["admin", "manager"].includes(role);
};

const sortByUserRole = (users: UserResponseProps[]) => {
  return users.sort((a, b) => a.role.localeCompare(b.role));
};

export { parseUsers, formatDate, canEdit, sortByUserRole };
