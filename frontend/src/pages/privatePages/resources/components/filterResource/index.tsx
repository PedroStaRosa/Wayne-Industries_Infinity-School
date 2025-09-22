import { useState } from "react";
import ButtonComponent from "../../../../../components/button";

interface FiltersProps {
  filters: {
    name: string;
    type: string;
    status: string;
    dateStart: string;
    dateEnd: string;
  };
  handleChangeFilter: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  clearFilters: () => void;
}

const Filters = ({
  filters,
  handleChangeFilter,
  clearFilters,
}: FiltersProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className={`md:hidden ${
          mobileOpen
            ? "bg-delete hover:bg-delete-hover"
            : "bg-primary hover:bg-primary-hover"
        }  text-white px-4 py-2 rounded mb-2 w-full flex justify-center items-center`}
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? "Fechar filtros" : "Abrir filtros"}
      </button>

      <div
        className={`flex flex-col gap-2 md:flex-row md:gap-3 ${
          mobileOpen ? "block" : "hidden"
        } md:flex`}
      >
        <input
          type="text"
          name="name"
          placeholder="Filtrar por nome"
          value={filters.name}
          onChange={handleChangeFilter}
          className="p-2 rounded-md border border-gray-300 bg-white  w-full md:flex-1"
        />

        <select
          name="type"
          value={filters.type}
          onChange={handleChangeFilter}
          className="p-2 rounded-md border border-gray-300 bg-white w-full md:flex-1"
        >
          <option value="">Tipo</option>
          <option value="Veiculo">Veículos</option>
          <option value="Seguranca">Dispositivos de segurança</option>
          <option value="Equipamento">Inventário de equipamentos</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleChangeFilter}
          className="p-2 rounded-md border border-gray-300 bg-white w-full md:flex-1"
        >
          <option value="">Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
          <option value="Manutencao">Manutenção</option>
        </select>

        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <label className="text-sm md:whitespace-nowrap">Data Início:</label>
          <input
            type="date"
            name="dateStart"
            value={filters.dateStart}
            onChange={handleChangeFilter}
            className="p-2 rounded-md border border-gray-300 bg-white w-full md:w-auto"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <label className="text-sm md:whitespace-nowrap">Data Fim:</label>
          <input
            type="date"
            name="dateEnd"
            value={filters.dateEnd}
            onChange={handleChangeFilter}
            className="p-2 rounded-md border border-gray-300 bg-white w-full md:w-auto"
          />
        </div>

        <div className="flex justify-end md:justify-center w-full md:w-auto">
          <ButtonComponent variant="danger" onClick={clearFilters}>
            Limpar
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default Filters;
