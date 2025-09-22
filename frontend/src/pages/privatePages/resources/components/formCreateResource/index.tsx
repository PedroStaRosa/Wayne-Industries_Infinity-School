import { useState } from "react";
import type { ResourceCreateType } from "../../../../../types/resourceCreateType";
import { toast } from "react-toastify";
/* import "./formCreateResourceStyles.css"; */

interface FormCreateResourceProps {
  createResource: (data: ResourceCreateType) => Promise<void>;
  closeCreateResource: () => void;
}

const FormCreateResource = ({
  createResource,
  closeCreateResource,
}: FormCreateResourceProps) => {
  const [createResourceError, setCreateResourceError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formResource, setFormResource] = useState({
    name: "",
    type: "",
    status: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formResource.name.trim() === "" ||
      !formResource.name ||
      !formResource.status ||
      !formResource.type
    ) {
      toast.error("Preencha todos os campos");
      return;
    }

    const newResource: ResourceCreateType = {
      nameResource: formResource.name,
      statusResource: formResource.status,
      typeResource: formResource.type,
    };
    try {
      setLoading(true);
      await createResource(newResource);
      setLoading(false);
      setCreateResourceError("");
      closeCreateResource();
    } catch {
      setCreateResourceError("Erro ao criar recurso");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCreateResource = () => {
    closeCreateResource();
  };
  return (
    <section className="flex flex-col bg-gray-200 mt-4 p-4 rounded-lg h-full w-full">
      <div className="">
        <h3 className="text-2xl font-bold">Cadastrar recurso</h3>
        <p className="text-title-secondary font-semibold">
          Cadastro de um novo recurso
        </p>
      </div>

      <form onSubmit={(e) => handleCreate(e)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="resourceName" className="text-gray-700 font-bold">
              Nome:
            </label>
            <input
              className="p-2 rounded-md border border-gray-300 bg-white"
              type="text"
              id="resourceName"
              onChange={(e) =>
                setFormResource({ ...formResource, name: e.target.value })
              }
              placeholder="Nome do recurso"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="resourceType" className="text-gray-700 font-bold">
              Tipo:
            </label>
            <select
              className="p-2 rounded-md border border-gray-300 bg-white "
              id="resourceType"
              onChange={(e) =>
                setFormResource({ ...formResource, type: e.target.value })
              }
              defaultValue=""
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
            <label htmlFor="resourceStatus" className="text-gray-700 font-bold">
              Status:
            </label>
            <select
              className="p-2 rounded-md border border-gray-300 bg-white"
              id="resourceStatus"
              onChange={(e) =>
                setFormResource({ ...formResource, status: e.target.value })
              }
              defaultValue=""
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

          {createResourceError && (
            <p className="text-red-500">{createResourceError}</p>
          )}
        </div>
        <div className="text-white flex justify-between">
          <button
            disabled={loading}
            type="submit"
            className="p-4 bg-primary hover:bg-primary-hover rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
          <button
            type="button"
            className="p-4 bg-red-500 hover:bg-red-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleCloseCreateResource()}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormCreateResource;
