import { FiEdit, FiTrash2 } from "react-icons/fi";
import type { ResourceProps } from "../../types/resourcesType";
import type { Role } from "../../types/rolesTypes";
import type UserResponseProps from "../../types/userResponseType";
import { canEdit, formatDate } from "../../utils/utils";
import ConfirmModal from "../confimModal";
import { useState } from "react";
import { toast } from "react-toastify";

const TableResources = ({
  allResources,
  currentUser,
  isActionsVisible,
  onEditResource,
  onDeleteResource,
  isResourcesPage,
}: {
  allResources: ResourceProps[];
  currentUser: UserResponseProps;
  isActionsVisible: boolean;
  isResourcesPage?: boolean;
  onEditResource?: (resource: ResourceProps) => void;
  onDeleteResource?: (id: string) => Promise<void>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] =
    useState<ResourceProps | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteResource = (resource: ResourceProps) => {
    setResourceToDelete(resource);
    setIsModalOpen(true);
  };

  const confirmDeleteResource = async () => {
    try {
      setLoading(true);
      if (!resourceToDelete) {
        toast.error("Erro ao deletar recurso");

        return;
      }
      if (onDeleteResource) {
        await onDeleteResource(resourceToDelete.id);

        return;
      }
      toast.error("Erro ao deletar recurso");
    } catch {
      toast.error("Erro ao deletar recurso");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };
  return (
    <>
      <div
        className={`hidden rounded-lg shadow-md overflow-x-auto md:block  ${
          isResourcesPage ? "max-h-[600px]" : "max-h-64"
        } `}
      >
        <table className="w-full ">
          <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
            <tr>
              <th className="px-4 py-2 text-left">Nome</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Criado em</th>
              <th className="px-4 py-2 text-left">Última atualização</th>
              {isActionsVisible && canEdit(currentUser.role as Role) && (
                <th className="px-4 py-2 text-center">Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {allResources && allResources.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center">
                  Nenhum recurso encontrado
                </td>
              </tr>
            )}
            {allResources &&
              allResources.map((resource) => (
                <tr
                  key={resource.id}
                  className="hover:bg-gray-100 border-b border-gray-200 last:border-0 odd:bg-gray-50 even:bg-white"
                >
                  <td className="px-4 py-2">{resource.name}</td>
                  <td className="px-4 py-2">{resource.type}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded font-bold ${
                        resource.status === "Ativo"
                          ? "bg-green-500 text-white"
                          : resource.status === "Inativo"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(resource.created_at as Date, "reduced")}
                  </td>
                  <td className="px-4 py-2">
                    {resource.updated_at &&
                      formatDate(resource.updated_at as Date, "full")}
                  </td>
                  {isActionsVisible && canEdit(currentUser.role as Role) && (
                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                      {onEditResource && (
                        <button
                          className="p-1 rounded hover:bg-yellow-100 text-yellow-600"
                          onClick={() => onEditResource(resource)}
                        >
                          <FiEdit size={24} />
                        </button>
                      )}
                      {onDeleteResource && (
                        <button
                          className="p-1 rounded hover:bg-red-100 text-red-600"
                          onClick={() => handleDeleteResource(resource)}
                        >
                          {currentUser.role === "admin" && (
                            <FiTrash2 size={24} />
                          )}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Lista responsiva para mobile */}
      <div className="block overflow-x-auto h-screen md:hidden">
        {allResources &&
          allResources.map((resource) => (
            <div
              key={resource.id}
              className="p-4 border-b flex shadow flex-col rounded-md mb-2  border-gray-200 last:border-0 sm:flex-row"
            >
              <div className="flex-1 ">
                <p className="mb-2">
                  <strong>Nome:</strong> {resource.name}
                </p>
                <p className="mb-2">
                  <strong>Tipo:</strong> {resource.type}
                </p>
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded font-bold ${
                      resource.status === "Ativo"
                        ? "bg-green-500 text-white"
                        : resource.status === "Inativo"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {resource.status}
                  </span>
                </p>
                <p className="mb-2">
                  <strong>Criado em:</strong>{" "}
                  {formatDate(resource.created_at as Date, "reduced")}
                </p>
                <p className="mb-2">
                  <strong>Atualizado em:</strong>{" "}
                  {resource.updated_at &&
                    formatDate(resource.updated_at as Date, "full")}
                </p>
              </div>
              {isActionsVisible && canEdit(currentUser.role as Role) && (
                <div className="flex gap-2 flex-row justify-between sm:flex-col">
                  {onEditResource && (
                    <button
                      className="p-1 rounded hover:bg-yellow-100 text-yellow-600"
                      onClick={() => onEditResource(resource)}
                    >
                      <FiEdit size={24} />
                    </button>
                  )}
                  {onDeleteResource && (
                    <button
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                      onClick={() => handleDeleteResource(resource)}
                    >
                      {currentUser.role === "admin" && <FiTrash2 size={24} />}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>

      {isModalOpen && resourceToDelete && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDeleteResource}
          textLoadingAction="Deletando recurso..."
          loading={loading}
        >
          Tem certeza que deseja deletar{" "}
          <strong>{resourceToDelete?.name}</strong>?
        </ConfirmModal>
      )}
    </>
  );
};

export default TableResources;
