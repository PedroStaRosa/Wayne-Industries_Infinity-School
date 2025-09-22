import { useState } from "react";
import ButtonComponent from "../../../../components/button";

interface FiltersProps {
  filters: {
    usernameCreatedAction: string;
    dateStart: string;
    dateEnd: string;
  };
  handleChangeFilter: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  clearFilters: () => void;
}

const FilterLogs = ({
  filters,
  handleChangeFilter,
  clearFilters,
}: FiltersProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="mb-4 mt-4">
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
        <div className="flex flex-col gap-2 w-full md:max-w-1/3">
          <label className="text-sm font-bold md:whitespace-nowrap">
            Nome do usuário:
          </label>
          <input
            type="text"
            name="usernameCreatedAction"
            placeholder="Nome do usuário"
            value={filters.usernameCreatedAction}
            onChange={handleChangeFilter}
            className="p-2 rounded-md border border-gray-300 bg-white w-full md:flex-1"
          />
        </div>

        {/* <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto"> */}
        <div className="flex md:flex-row md:items-center gap-2 w-full md:w-auto">
          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-bold md:whitespace-nowrap">
              Data Início:
            </label>
            <input
              type="date"
              name="dateStart"
              value={filters.dateStart}
              onChange={handleChangeFilter}
              className="p-2 rounded-md border border-gray-300 bg-white w-full md:w-auto"
            />
          </div>

          <div className="flex flex-col w-full gap-2">
            <label className="text-sm font-bold md:whitespace-nowrap">
              Data Fim:
            </label>
            <input
              type="date"
              name="dateEnd"
              value={filters.dateEnd}
              onChange={handleChangeFilter}
              className="p-2 rounded-md border border-gray-300 bg-white w-full md:w-auto"
            />
          </div>
        </div>

        <div className="flex justify-end items-baseline-last md:justify-center w-full md:w-auto">
          <ButtonComponent variant="danger" onClick={clearFilters}>
            Limpar
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default FilterLogs;
