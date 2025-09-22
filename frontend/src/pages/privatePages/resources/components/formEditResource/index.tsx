import { useState } from "react";
import type { ResourceProps } from "../../../../../types/resourcesType";
import { formatDate } from "../../../../../utils/utils";
import { toast } from "react-toastify";

interface FormEditResourceProps {
  resource: ResourceProps;
  updateResource: (data: ResourceProps) => Promise<void>;
  closeEditResource: () => void;
}

const FormEditResource = ({
  resource,
  updateResource,
  closeEditResource,
}: FormEditResourceProps) => {
  const [formData, setFormData] = useState<ResourceProps>({
    id: resource.id,
    name: resource.name,
    type: resource.type,
    status: resource.status,
    created_at: resource.created_at,
    updated_at: resource.updated_at,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      formData.name.trim() === "" ||
      !formData.name ||
      !formData.type ||
      !formData.status
    ) {
      toast.error("Preencha todos os campos");
      setLoading(false);
      return;
    }
    await updateResource(formData);
    setLoading(false);
    closeEditResource();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center bg-gray-900/30 justify-center backdrop-blur-xs p-2 md:ml-64 "
      onClick={closeEditResource}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Editar Recurso</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-gray-700 font-bold">Nome</label>
              <input
                name="name"
                className="p-2 rounded-md border border-gray-300 bg-white"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-gray-700 font-bold">Tipo</label>
              <select
                className="p-2 rounded-md border border-gray-300 bg-white "
                name="type"
                onChange={handleChange}
                value={formData.type}
              >
                <option
                  value=""
                  style={{ backgroundColor: "var(--color-default-select)" }}
                  disabled
                >
                  Selecione
                </option>
                <option value="Veiculo">Veículos</option>
                <option value="Seguranca">Dispositivos de segurança</option>
                <option value="Equipamento">Inventário de equipamentos</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-gray-700 font-bold">Status</label>
              <select
                className="p-2 rounded-md border border-gray-300 bg-white "
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option
                  value=""
                  style={{ backgroundColor: "var(--color-default-select)" }}
                  disabled
                >
                  Selecione
                </option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Manutencao">Manutenção</option>
              </select>
            </div>

            <div className="flex gap-4 justify-center mt-4">
              <button
                disabled={loading}
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
              <button
                disabled={loading}
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={closeEditResource}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
        {formData.updated_at && (
          <p>
            Ultima Atualização:{" "}
            {formatDate(formData.updated_at as Date, "full")}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormEditResource;
