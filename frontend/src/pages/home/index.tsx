/* import "./home.css"; */
import logoWayne from "../../assets/Wayne_logo.png";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const HomePage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      if (!email || email === "" || !password || password === "") {
        setError("Preencha todos os campos");
        return;
      }
      const response = await api.login(email, password);

      if (response.status === 401) {
        setError("Email ou senha incorretos");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch {
      setError(
        "Não foi possível conectar ao servidor. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center bg-background-primary justify-center min-h-screen w-full px-4 md:px-0">
      {/* Header */}
      <div className="p-6 rounded-lg w-full max-w-lg md:max-w-2xl text-center">
        <h1 className="text-yellow-400 text-2xl md:text-3xl font-bold mb-2">
          Indústrias Wayne
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Sistema de Gerenciamento de Segurança
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="p-6 flex flex-col justify-center items-center gap-3 w-full max-w-lg md:max-w-2xl bg-white rounded-lg shadow-[1px_3px_3px_rgba(250,204,21,0.75)] mt-6"
      >
        <img src={logoWayne} alt="Logo Wayne" className="w-32 md:w-40" />

        {/* Email */}
        <div className="w-full flex flex-col">
          <label htmlFor="email" className="font-medium text-gray-800">
            Email
          </label>
          <input
            type="email"
            ref={emailRef}
            placeholder="Digite seu email"
            required
            className="h-10 rounded-lg border border-gray-800 px-2 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        {/* Password */}
        <div className="w-full flex flex-col">
          <label htmlFor="password" className="font-medium text-gray-800">
            Senha
          </label>
          <input
            type="password"
            ref={passwordRef}
            placeholder="Digite sua senha"
            required
            className="h-10 rounded-lg border border-gray-800 px-2 focus:outline-none focus:border-yellow-400 transition"
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-600 font-medium">{error}</p>}

        {/* Botão login */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-secondary rounded-lg font-bold mt-6 transition hover:bg-secondary-hover disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Usuários teste */}
      <div className="bg-gray-700 rounded-lg p-4 mt-10 w-full max-w-lg md:max-w-2xl flex flex-col text-white">
        <span className="font-bold mb-2">
          Usuários teste para avaliar o sistema (semente no backend):
        </span>

        {[
          { role: "admin", email: "bruce@wayne.com", pass: "bruce123" },
          { role: "manager", email: "alfred@wayne.com", pass: "alfred123" },
          { role: "employee", email: "robin@wayne.com", pass: "robin123" },
        ].map((user) => (
          <span
            key={user.role}
            className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2"
          >
            <span className="underline font-bold bg-gray-800 px-2 py-1 rounded">
              {user.role}
            </span>
            <span>
              {user.email} / {user.pass}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
