import { useState } from "react";
import { toast } from "react-toastify";
import type UserType from "../../../../types/userType";
import { ROLES } from "../../../../types/rolesTypes";
import ButtonComponent from "../../../../components/button";

const UserForm = ({
  onCreateUser,
}: {
  onCreateUser: (data: UserType) => Promise<void>;
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      form.name.trim() === "" ||
      !form.name ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (form.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      const name = form.name;
      const email = form.email;
      const password = form.password;
      const role = form.role;

      const data: UserType = { name, email, password, role };
      await onCreateUser(data);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
      });
    } catch {
      toast.error("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex flex-col bg-gray-200 mt-4 p-4 rounded-lg h-full w-full">
      <div className="">
        <h3 className="text-2xl font-bold">Cadastrar Usuário</h3>
        <p className="text-title-secondary font-semibold">
          Cadastro de um novo usuário
        </p>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="name" className="text-gray-700 font-bold">
              Nome
            </label>
            <input
              className="p-2 rounded-md border border-gray-300 bg-white"
              type="text"
              id="name"
              name="name"
              placeholder="Digite o nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="email" className="text-gray-700 font-bold">
              E-mail
            </label>
            <input
              className="p-2 rounded-md border border-gray-300 bg-white"
              type="email"
              id="email"
              name="email"
              placeholder="Digite o email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="password" className="text-gray-700 font-bold">
              Senha
            </label>
            <input
              className="p-2 rounded-md border border-gray-300 bg-white"
              type="password"
              id="password"
              name="password"
              placeholder="Digite a senha"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="role" className="text-gray-700 font-bold">
              Função
            </label>
            <select
              className="p-2 rounded-md border border-gray-300 bg-white"
              id="role"
              name="role"
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option
                value=""
                style={{ backgroundColor: "var(--color-default-select)" }}
              >
                Selecione
              </option>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ButtonComponent type="submit" variant="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </ButtonComponent>
        {/* <button
          type="submit"
          className="p-4 bg-primary hover:bg-primary-hover rounded-md text-white font-bold"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button> */}
      </form>
    </section>
  );
};

export default UserForm;
