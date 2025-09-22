import { FiEdit } from "react-icons/fi";
import type UserResponseProps from "../../../../types/userResponseType";
import { formatDate } from "../../../../utils/utils";

const TableUsers = ({
  currentUser,
  allUsers,
  onEditUser,
}: {
  currentUser: UserResponseProps;
  allUsers: UserResponseProps[];
  fetchUsers: () => void;
  onEditUser?: (userSelected: UserResponseProps) => void;
}) => {

  return (
    <>
      {/* Desktop */}
      <div className=" hidden max-h-[700px] rounded-lg shadow-md overflow-x-auto overflow-y-auto md:block">
        <table className="w-full border-collapse rounded-lg shadow-md overflow-x-auto overflow-y-auto">
          <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Cargo</th>
              <th className="px-4 py-2 text-left">Cadastro</th>
              {currentUser.role === "admin" && (
                <th className="px-4 py-2 text-left">Editar</th>
              )}
            </tr>
          </thead>
          <tbody>
            {allUsers &&
              allUsers?.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 border-b border-gray-200 last:border-0"
                >
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded font-bold  ${
                        user.role === "admin"
                          ? "bg-green-500 text-white"
                          : user.role === "manager"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(user.created_at as Date, "reduced")}
                  </td>
                  {currentUser.role === "admin" && onEditUser && (
                    <td className="px-4 py-2">
                      <button
                        className="p-1 rounded hover:bg-yellow-100 text-yellow-600"
                        onClick={() => onEditUser(user)}
                      >
                        <FiEdit size={24} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Mobile*/}
      <div className="block overflow-x-auto h-screen md:hidden">
        {allUsers &&
          allUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 border-b flex shadow flex-col rounded-md mb-2  border-gray-200 last:border-0 sm:flex-row"
            >
              <div className="flex-1 ">
                <p className="mb-2">
                  <strong>Nome:</strong> {user.name}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="mb-2">
                  <strong>Cargo:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded font-bold  ${
                      user.role === "admin"
                        ? "bg-green-500 text-white"
                        : user.role === "manager"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
                <p className="mb-2">
                  <strong>Criado em:</strong>{" "}
                  {formatDate(user.created_at as Date, "reduced")}
                </p>
              </div>
              {currentUser.role === "admin" && onEditUser && (
                <div className="px-4 py-2 flex justify-center items-center">
                  <button
                    className="p-1 rounded hover:bg-yellow-100 text-yellow-600"
                    onClick={() => onEditUser(user)}
                  >
                    <FiEdit size={24} />
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      
    </>
  );
};

export default TableUsers;
