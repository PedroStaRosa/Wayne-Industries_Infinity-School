import { useState } from "react";
import { ROLES } from "../../../../types/rolesTypes";
import type UserResponseProps from "../../../../types/userResponseType";
import ButtonComponent from "../../../../components/button";
import { toast } from "react-toastify";
import ConfirmModal from "../../../../components/confimModal";

interface FormEditUserProps {
  userSelected: UserResponseProps;
  closeEditUser: () => void;
  updateUser: (data: UserResponseProps) => Promise<void>;
  deleteUser: (data: UserResponseProps) => Promise<void>;
}

const FormEditUser = ({
  userSelected,
  closeEditUser,
  updateUser,
  deleteUser,
}: FormEditUserProps) => {
  const [formData, setFormData] = useState<UserResponseProps>({
    id: userSelected.id,
    role: userSelected.role,
    name: userSelected.name,
    email: userSelected.email,
    token: userSelected.token,
    created_at: userSelected.created_at,
    updated_at: userSelected.updated_at,
  });

  const [loading, setLoading] = useState({
    update: false,
    delete: false,
  });
  const isProcessing = loading.update || loading.delete;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !userSelected ||
      !userSelected.role ||
      !userSelected.id ||
      !formData.role
    )
      return;
    if (userSelected.role === formData.role) {
      toast.error("Selecione um cargo diferente");
      return;
    }
    setLoading((prev) => ({ ...prev, update: true }));
    await updateUser(formData);
    setLoading((prev) => ({ ...prev, update: false }));
    closeEditUser();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserResponseProps | null>(
    null
  );

  const handleDeleteUser = (user: UserResponseProps) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    setLoading((prev) => ({ ...prev, delete: true }));
    await deleteUser(userSelected);
    setLoading((prev) => ({ ...prev, delete: false }));
    closeEditUser();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center bg-gray-900/30 justify-center backdrop-blur-xs p-2 md:ml-64 "
        onClick={closeEditUser}
      >
        <div
          className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h3 className="text-lg font-semibold">Controle de Usuário</h3>
            <p className="text-sm text-gray-500">
              Mude o cargo ou exclua o usuário
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div>
              <p>
                <span className="text-gray-700 font-bold">Usuário: </span>
                {userSelected.name}
              </p>
            </div>
            <form className="" onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-gray-700 font-bold" htmlFor="role">
                  Função
                </label>
                <select
                  className="p-2 rounded-md border border-gray-300 bg-white "
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option
                    value=""
                    style={{
                      backgroundColor: "var(--color-default-select)",
                    }}
                    disabled
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
              <div className="flex justify-between mt-4">
                <ButtonComponent
                  variant="submit"
                  type="submit"
                  disabled={isProcessing}
                >
                  {loading.update ? "Salvando..." : "Salvar"}
                </ButtonComponent>
                <ButtonComponent
                  variant="danger"
                  onClick={() => {
                    handleDeleteUser(userSelected);
                  }}
                  disabled={isProcessing}
                >
                  {loading.delete ? "Deletando..." : "Deletar"}
                </ButtonComponent>
                <ButtonComponent
                  variant="close"
                  onClick={() => closeEditUser()}
                  disabled={isProcessing}
                >
                  Cancelar
                </ButtonComponent>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isModalOpen && userToDelete && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDeleteUser}
          textLoadingAction="Deletando usuario..."
          loading={loading.delete}
        >
          Tem certeza que deseja deletar <strong>{userToDelete.name}</strong>?
        </ConfirmModal>
      )}
    </>
  );
};

export default FormEditUser;
