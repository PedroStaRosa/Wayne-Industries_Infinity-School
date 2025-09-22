import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { FaArrowUp } from "react-icons/fa";
/* import { createUsersSeed } from "../../utils/seeds"; */

interface UserProps {
  role: string;
  name: string;
  token: string;
}

const AsideMenu = () => {
  const storedUser = localStorage.getItem("currentUser");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const [user] = useState<UserProps>(initialUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <>
      {/* Botão Mobile */}
      <button
        id="menu-button"
        className="block items-center justify-center w-10 h-10 md:hidden top-4 left-5 z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <IoMenu size={36} />
      </button>
      <div className="md:hidden">
        <a
          href="#menu-button"
          className="bg-secondary flex gap-2 justify-center items-center font-bold px-4 py-4 text-black rounded-full absolute bottom-2 right-2 md:hidden"
        >
          <FaArrowUp /> Topo
        </a>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background-primary/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Menu Mobile */}
      <menu
        className={`fixed top-0 left-0 z-50 w-80 h-full bg-background-primary flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}
      >
        <div className="p-5 text-center border-b border-gray-700">
          <div
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer"
          >
            <h1 className="text-2xl font-bold text-title-primary mb-1">
              Wayne
            </h1>
            <p className="text-sm text-title-secondary">Segurança Interna</p>
          </div>
          <p className="text-md text-title-secondary mt-5">
            Usuário: <span className="font-bold">{user.name}</span>
          </p>
          <p className="text-title-secondary">{user.role}</p>
        </div>

        <nav className="flex text-white border-b border-gray-700 flex-col gap-3 p-5 overflow-y-auto items-center font-bold text-xl">
          <a
            className="hover:text-white transition-colors duration-300 ease-in-out w-full flex justify-center hover:bg-secondary-hover rounded-md p-2.5"
            href="/dashboard"
          >
            Dashboard
          </a>
          <a
            className="hover:text-white transition-colors duration-300 ease-in-out w-full flex justify-center hover:bg-secondary-hover rounded-md p-2.5"
            href="/resources"
          >
            Recursos
          </a>
          {(user.role === "admin" || user.role === "manager") && (
            <a
              className="hover:text-white transition-colors duration-300 ease-in-out w-full flex justify-center hover:bg-secondary-hover rounded-md p-2.5"
              href="/users"
            >
              Usuários
            </a>
          )}
          {(user.role === "admin" || user.role === "manager") && (
            <a
              className="hover:text-white transition-colors duration-300 ease-in-out w-full flex justify-center hover:bg-secondary-hover rounded-md p-2.5"
              href="/logs"
            >
              Logs
            </a>
          )}
        </nav>
        <div className="flex-1" onClick={() => setSidebarOpen(false)}></div>
        <div className="p-5 border-t border-gray-700">
          <button
            className="w-full font-bold p-2.5 border-none rounded-md bg-secondary text-black hover:bg-secondary-hover hover:text-white transition-colors duration-300 ease-in-out"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </menu>

      {/* Menu Desktop */}
      <aside
        className={`hidden md:fixed md:top-0 md:left-0 md:flex bg-background-primary flex-col justify-between w-64 h-full`}
      >
        <div className="p-5 text-center border-b border-gray-700">
          <div
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer"
          >
            <h1 className="text-2xl font-bold text-title-primary mb-1">
              Wayne
            </h1>
            <p className="text-sm text-title-secondary">Segurança Interna</p>
          </div>
          <p className="text-md text-title-secondary mt-5">
            Usuário: <span className="font-bold">{user.name}</span>
          </p>
          <p className="text-title-secondary">{user.role}</p>
        </div>

        <nav className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-3 p-5 text-white overflow-y-auto items-center font-bold text-xl">
            <a
              className="hover:text-white transition-colors duration-300 ease-in-out w-full flex justify-center hover:bg-secondary-hover rounded-md p-2.5"
              href="/dashboard"
            >
              Dashboard
            </a>
            <a
              className="hover:text-white transition-colors duration-300 ease-in-out w-full flex justify-center hover:bg-secondary-hover rounded-md p-2.5"
              href="/resources"
            >
              Recursos
            </a>
            {(user.role === "admin" || user.role === "manager") && (
              <a
                className="hover:text-white transition-colors duration-300 ease-in-out w-full flex justify-center hover:bg-secondary-hover rounded-md p-2.5"
                href="/users"
              >
                Usuários
              </a>
            )}
            {(user.role === "admin" || user.role === "manager") && (
              <a
                className="hover:text-white transition-colors duration-300 ease-in-out w-full flex justify-center hover:bg-secondary-hover rounded-md p-2.5"
                href="/logs"
              >
                Logs
              </a>
            )}
          </div>

          {/* {user.role === "admin" && (
            <div className="items-center justify-center flex">
              <ButtonComponent
                type="button"
                variant="submit"
                className="text-sm"
                onClick={() => createUsersSeed(user.token)}
              >
                Rodar Seed Usuarios
              </ButtonComponent>
            </div>
          )} */}
        </nav>

        <div className="p-5 border-t border-gray-700">
          <button
            className="w-full font-bold p-2.5 border-none rounded-md bg-secondary text-black hover:bg-secondary-hover hover:text-white transition-colors duration-300 ease-in-out"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </aside>
    </>
  );
};

export default AsideMenu;
