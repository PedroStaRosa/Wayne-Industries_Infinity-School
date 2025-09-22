// src/helpers/protectedLogins.ts
export const protectedLogins = [
  "bruce@wayne.com",
  "robin@wayne.com",
  "alfred@wayne.com",
];

// Função que verifica se o email é protegido
export const isProtectedLogin = (id: string): boolean => {
  return protectedLogins.includes(id);
};
