import Container from "../../../components/container";
import type UserResponseProps from "../../../types/userResponseType";
import TableResources from "../../../components/tableResources";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ResourceProps } from "../../../types/resourcesType";
import { api } from "../../../utils/api";
import { FiPlusCircle } from "react-icons/fi";
import type { ResourceCreateType } from "../../../types/resourceCreateType";
import FormCreateResource from "./components/formCreateResource";
import { toast } from "react-toastify";
import FormEditResource from "./components/formEditResource";
import { IoCloseCircle } from "react-icons/io5";
import { useDebounce } from "../../../hooks/useDebounce";
import Filters from "./components/filterResource";

const initialFilters = {
  name: "",
  type: "",
  status: "",
  dateStart: "",
  dateEnd: "",
};

const ResourcesPage = ({ currentUser }: { currentUser: UserResponseProps }) => {
  const [allResources, setAllResources] = useState<ResourceProps[]>([]);
  const [openCreateResource, setOpenCreateResource] = useState({
    open: false,
    description: "Criar Recurso",
  });
  const [openEditResource, setOpenEditResource] =
    useState<ResourceProps | null>(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState(initialFilters);

  // Evitar recriação de fetchResources em cada render
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        setAllResources([]);
        return;
      }

      const resources = await api.fetchResourses(currentUser.token);
      setAllResources(resources);
    } catch {
      toast.error("Erro ao buscar recursos");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleChangeFilter = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => setFilters(initialFilters);

  /* DEBOUNCE DE MEIO SEGUNDO PARA EVITAR O FILTRO SER CHAMADO CONSTANTEMENTE */
  const debouncedFiltersName = useDebounce(filters.name, 1000);

  //Evitar recalcular em cada render
  const resourcesFilterdDate = useMemo(() => {
    return allResources.filter((resource) => {
      const nomeMatch = resource.name
        .toLowerCase()
        .includes(debouncedFiltersName.toLowerCase()); // usa debounce aqui
      const tipoMatch = filters.type === "" || resource.type === filters.type;
      const statusMatch =
        filters.status === "" || resource.status === filters.status;

      const dataCriado = new Date(resource.created_at);
      const dataInicio = filters.dateStart ? new Date(filters.dateStart) : null;
      const dataFim = filters.dateEnd ? new Date(filters.dateEnd) : null;

      const dataMatch =
        (!dataInicio || dataCriado >= dataInicio) &&
        (!dataFim || dataCriado <= dataFim);

      return nomeMatch && tipoMatch && statusMatch && dataMatch;
    });
  }, [
    allResources,
    debouncedFiltersName,
    filters.type,
    filters.status,
    filters.dateStart,
    filters.dateEnd,
  ]);

  const handleCreateResource = async (data: ResourceCreateType) => {
    try {
      setLoading(true);
      const response = await api.new_resource(data, currentUser.token);
      if (response.status === false) {
        throw new Error(response.msg);
      }

      toast.success(response.msg);
      fetchResources();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? "Error" + error.message
          : "Erro ao criar recurso"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateResource = async (data: ResourceProps) => {
    try {
      const response = await api.update_resource(data, currentUser.token);
      if (response.status === false) return;
      toast.success(response.msg);
      fetchResources();
    } catch {
      toast.error("Erro ao atualizar recurso");
    }
  };

  const handleDeleteResource = async (id: string) => {
    try {
      const response = await api.deleteResources(currentUser.token, id);
      if (!response.status) {
        throw new Error(response.msg);
      }
      toast.success(response.msg);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir");
    } finally {
      fetchResources();
    }
  };

  const handleOpenAndCloseCreateResource = () => {
    if (openCreateResource.open) {
      setOpenCreateResource({ open: false, description: "Criar Recurso" });
      return;
    }

    setOpenCreateResource({ open: true, description: "Fechar" });
  };

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <Container>
      <header className="flex flex-col justify-center items-center pb-4 mb-4 border-collapse rounded-lg shadow-md">
        <h2 className="font-bold text-3xl ">Recursos</h2>
      </header>
      {currentUser &&
        (currentUser.role === "admin" || currentUser.role === "manager") && (
          <section className="mb-5">
            <button
              disabled={loading}
              className={`${
                openCreateResource.open
                  ? "bg-red-500 hover:bg-red-300"
                  : "bg-primary hover:bg-primary-hover"
              } text-white py-2 px-4 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleOpenAndCloseCreateResource}
            >
              {openCreateResource.open ? (
                <IoCloseCircle size={24} />
              ) : (
                <FiPlusCircle size={24} />
              )}
              {openCreateResource.description}
            </button>
            {openCreateResource.open && (
              <FormCreateResource
                createResource={handleCreateResource}
                closeCreateResource={handleOpenAndCloseCreateResource}
              />
            )}
          </section>
        )}

      <section>
        <h3 className="font-bold text-2xl mb-4">Recursos</h3>
        <h2>Filtros:</h2>
        <Filters
          filters={filters}
          handleChangeFilter={handleChangeFilter}
          clearFilters={clearFilters}
        />

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <TableResources
            isActionsVisible
            currentUser={currentUser}
            allResources={resourcesFilterdDate || []}
            onEditResource={setOpenEditResource}
            onDeleteResource={handleDeleteResource}
            isResourcesPage
          />
        )}
      </section>
      {openEditResource && (
        <FormEditResource
          resource={openEditResource}
          updateResource={handleUpdateResource}
          closeEditResource={() => setOpenEditResource(null)}
        />
      )}
    </Container>
  );
};

export default ResourcesPage;
