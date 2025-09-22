import { toast } from "react-toastify";
import { api } from "./api";

const createUsersSeed = async (tokenUser: string) => {
  try {
    for (let i = 0; i < 9; i++) {
      const data = {
        name: `userSeed${i}`,
        email: `userSeed${i}@wayner.com`,
        password: `userSeed${i}userSeed${i}@wayner.com`,
        role: "employee",
      };
      const response = await api.create_user(data, tokenUser);
      if (response.status === false) {
        toast.error(response.msg);
        return;
      }
      toast.success(response.msg);
    }
  } catch {
    toast.error("Erro ao criar usuários");
  }
};

export { createUsersSeed };
