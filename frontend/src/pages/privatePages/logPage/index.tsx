import { useCallback, useEffect, useMemo, useState } from "react";
import Container from "../../../components/container";
import TableLogComponent from "../../../components/tableLogs";
import type UserResponseProps from "../../../types/userResponseType";
import { toast } from "react-toastify";
import { api } from "../../../utils/api";
import type { LogsType } from "../../../types/logsType";
import FilterLogs from "./components/filterLogs";
import { useDebounce } from "../../../hooks/useDebounce";

const initialFilters = {
  usernameCreatedAction: "",
  dateStart: "",
  dateEnd: "",
};

const LogsPage = ({ currentUser }: { currentUser: UserResponseProps }) => {
  const [logs, setLogs] = useState<LogsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const debouncedFiltersName = useDebounce(filters.usernameCreatedAction, 1000);

  const logsFilterdData = useMemo(() => {
    return logs.filter((log) => {
      const nameUserMatch = log.user_created_action
        .toLowerCase()
        .includes(debouncedFiltersName.toLowerCase());

      const dataCriado = new Date(log.created_at);
      const dataInicio = filters.dateStart ? new Date(filters.dateStart) : null;
      const dataFim = filters.dateEnd ? new Date(filters.dateEnd) : null;
      if (dataFim) {
        dataFim.setDate(dataFim.getDate() + 1);
      }

      const dataMatch =
        (!dataInicio || dataCriado >= dataInicio) &&
        (!dataFim || dataCriado <= dataFim);

      return nameUserMatch && dataMatch;
    });
  }, [logs, debouncedFiltersName, filters.dateStart, filters.dateEnd]);

  const handleChangeFilter = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => setFilters(initialFilters);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      if (!currentUser) {
        setLogs([]);
        return;
      }
      const fetchLogs = await api.fetchDashboardLogs(currentUser.token);
      setLogs(fetchLogs);
    } catch {
      toast.error("Erro ao buscar logs");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  return (
    <Container>
      <main className="flex flex-col flex-1">
        <header className="flex flex-col justify-center items-center">
          <h2 className="font-bold text-3xl">Logs Gerais do Sistema</h2>
        </header>
        <div>
          <FilterLogs
            filters={filters}
            handleChangeFilter={handleChangeFilter}
            clearFilters={clearFilters}
          />
        </div>
        <section className="mt-5">
          {loading && <p>Carregando...</p>}
          <TableLogComponent logList={logsFilterdData} isLogPage />
        </section>
      </main>
    </Container>
  );
};

export default LogsPage;
