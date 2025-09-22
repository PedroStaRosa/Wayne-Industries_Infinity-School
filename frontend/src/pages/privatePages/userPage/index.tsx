import { useEffect, useState } from "react";
import Container from "../../../components/container";
/* import "./userStyles.css"; */

import { api } from "../../../utils/api";

import type UserResponseProps from "../../../types/userResponseType";

import { parseUsers, sortByUserRole } from "../../../utils/utils";
import UserForm from "./components/userForm";
import TableUsers from "./components/tableUsers";
import { IoCloseCircle } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";

import FormEditUser from "./components/formEditUser";
import type UserType from "../../../types/userType";
import { toast } from "react-toastify";

const UserPage = ({ currentUser }: { currentUser: UserResponseProps }) => {
  /*   const navigate = useNavigate(); */
  const [allUsers, setAllUsers] = useState<UserResponseProps[] | null>(null);
  const [openCreateUser, setOpenCreateUser] = useState({
    open: false,
    description: "Criar Usuário",
  });
  const [openEditUser, setOpenEditUser] = useState<UserResponseProps | null>(
    null
  );

  const fetchUsers = async () => {
    try {
      if (!currentUser.token) {
        return;
      }

      const response = await api.fetchAllUsers(currentUser.token);
      const parsedUsers = parseUsers(response);
      setAllUsers(sortByUserRole(parsedUsers));
    } catch {
      toast.error("Erro ao buscar usuários");
    }
  };

  const handleOpenAndCloseCreateUser = () => {
    if (openCreateUser.open) {
      setOpenCreateUser({ open: false, description: "Criar Usuário" });
      return;
    }

    setOpenCreateUser({ open: true, description: "Fechar" });
  };

  const handleCreateUser = async (data: UserType) => {
    try {
      const response = await api.create_user(data, currentUser.token);
      if (response.status === false) {
        toast.error(response.msg);
        return;
      }
      toast.success(response.msg);
      fetchUsers();
    } catch {
      toast.error("Erro ao criar usuário");
    }
    handleOpenAndCloseCreateUser();
  };

  const handleUpdateUser = async (data: UserResponseProps) => {
    try {
      if (!data) return;
      if (!data.role) {
        toast.error("Selecione um cargo válido");
        return;
      }
      const response = await api.updateRoleUser(
        data.id,
        data.role,
        currentUser.token
      );

      if (response.status === false) {
        toast.error(response.msg);
        return;
      }
      toast.success(response.msg);
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar");
    }
  };

  const handleDeleteUser = async (data: UserResponseProps) => {
    try {
      const response = await api.deleteUser(currentUser.token, data.id);
      if (response.status === false) {
        toast.error(response.msg);
        return;
      }
      toast.success(response.msg);
      fetchUsers();
    } catch {
      toast.error("Erro ao deletar usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <header className="flex flex-col justify-center items-center pb-4 mb-4 border-collapse rounded-lg shadow-md">
        <h2 className="font-bold text-3xl ">Usuários</h2>
      </header>
      {currentUser.role === "admin" && (
        <section className="mb-5">
          <button
            className={`${
              openCreateUser.open
                ? "bg-red-500"
                : "bg-primary hover:bg-primary-hover"
            } text-white py-2 px-4 rounded-md flex items-center gap-2`}
            onClick={handleOpenAndCloseCreateUser}
          >
            {openCreateUser.open ? (
              <IoCloseCircle size={24} />
            ) : (
              <FiPlusCircle size={24} />
            )}
            {openCreateUser.description}
          </button>
          {openCreateUser.open && currentUser.role === "admin" && (
            <UserForm onCreateUser={handleCreateUser} />
          )}
        </section>
      )}

      <section className="p-5 overflow-auto flex-1">
        <TableUsers
          currentUser={currentUser}
          allUsers={allUsers!}
          fetchUsers={fetchUsers}
          onEditUser={setOpenEditUser}
        />
      </section>
      {openEditUser && (
        <FormEditUser
          userSelected={openEditUser}
          closeEditUser={() => setOpenEditUser(null)}
          updateUser={handleUpdateUser}
          deleteUser={handleDeleteUser}
        />
      )}
    </Container>
  );
};

export default UserPage;
