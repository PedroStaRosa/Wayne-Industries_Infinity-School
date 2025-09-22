import { useCallback, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import Container from "../../../components/container";
import type UserResponseProps from "../../../types/userResponseType";
import type { ResourceProps } from "../../../types/resourcesType";
import TableResources from "../../../components/tableResources";
import { toast } from "react-toastify";
import type { LogsType } from "../../../types/logsType";
import TableLogComponent from "../../../components/tableLogs";

interface ResourcesTypeProps {
  security: ResourceProps[];
  vehicle: ResourceProps[];
  equipment: ResourceProps[];
}

const DashboardPage = ({ currentUser }: { currentUser: UserResponseProps }) => {
  const [allResources, setAllResources] = useState<ResourceProps[] | null>(
    null
  );
  const [logs, setLogs] = useState<LogsType[]>([]);
  const [resourcesByType, setResourcesByType] =
    useState<ResourcesTypeProps | null>(null);

  const fetchResourses = useCallback(async () => {
    try {
      if (!currentUser) {
        setAllResources([]);
        return;
      }
      const fetchResources = await api.fetchResourses(currentUser.token);

      setAllResources(fetchResources);
      const getVeiculos = fetchResources.filter(
        (r: ResourceProps) => r.type === "Veiculo"
      );
      const getSeguranca = fetchResources.filter(
        (r: ResourceProps) => r.type === "Seguranca"
      );
      const getEquipamento = fetchResources.filter(
        (r: ResourceProps) => r.type === "Equipamento"
      );

      const resources: ResourcesTypeProps = {
        security: getSeguranca,
        vehicle: getVeiculos,
        equipment: getEquipamento,
      };

      setResourcesByType(resources);
    } catch {
      toast.error("Erro ao buscar recursos");
    }
  }, [currentUser]);

  const fetchDashboarLogs = useCallback(async () => {
    try {
      if (!currentUser) {
        setLogs([]);
        return;
      }
      const fetchLogs = await api.fetchDashboardLogs(currentUser.token, 10);

      setLogs(fetchLogs);
    } catch {
      toast.error("Erro ao buscar logs");
    }
  }, [currentUser]);

  useEffect(() => {
    fetchResourses();
    fetchDashboarLogs();
  }, [fetchResourses, fetchDashboarLogs]);

  if (!currentUser) {
    return null;
  }

  return (
    <Container>
      <section className="flex flex-col flex-1 h-[calc(100vh-64px)]">
        <header
          id="header"
          className="flex flex-col justify-center items-center"
        >
          <h2 className="font-bold text-3xl">Dashboard de Visão Geral</h2>
        </header>
        <div className="flex flex-col md:flex-row gap-2 mt-5 md:hidden">
          <nav className="flex flex-col md:flex-row gap-2">
            <p className="font-bold">Ir para:</p>

            <a
              href="#cards"
              className="bg-amber-300 text-black font-bold px-4 py-2 rounded-md shadow-md"
            >
              Total de recursos: {allResources?.length}
            </a>

            <a
              href="#resources"
              className="bg-amber-300 text-black px-4 font-bold py-2 rounded-md shadow-md"
            >
              Recursos
            </a>

            <a
              href="#logs"
              className="bg-amber-300 text-black px-4 font-bold py-2 rounded-md shadow-md"
            >
              Logs
            </a>
          </nav>
        </div>

        {/* CARDS */}
        <section
          id="cards"
          className="grid m-5 gap-5 grid-cols-1 md:grid-cols-3 items-stretch"
        >
          {/* Card 1 */}
          <div className="bg-gray-100 px-6 py-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <h3 className="mb-3 font-semibold text-2xl md:text-xl lg:text-2xl">
              Segurança
            </h3>
            <p className="text-4xl font-bold text-secondary leading-none">
              {resourcesByType?.security.length}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-100 px-6 py-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <h3 className="mb-3 font-semibold text-2xl md:text-xl lg:text-2xl">
              Equipamentos
            </h3>
            <p className="text-4xl font-bold text-secondary leading-none">
              {resourcesByType?.equipment.length}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-100 px-6 py-8 rounded-xl shadow-md flex flex-col items-center text-center">
            <h3 className="mb-3 font-semibold text-2xl md:text-xl lg:text-2xl">
              Veículos
            </h3>
            <p className="text-4xl font-bold text-secondary leading-none">
              {resourcesByType?.vehicle.length}
            </p>
          </div>
        </section>
        {/* TABELA DE RECURSOS */}
        <section id="resources" className="flex-1 ">
          <h3 className="font-bold text-2xl">Recursos</h3>
          <TableResources
            isActionsVisible={false}
            currentUser={currentUser}
            allResources={allResources || []}
          />
        </section>
        {/* TABELA DE LOGS */}
        <section id="logs" className="flex-1 4k:bg-amber-300">
          <h3 className="font-bold text-2xl">Ultimos 10 logs</h3>
          <a href="/logs">Todos logs</a>
          <TableLogComponent logList={logs} />
        </section>
      </section>
    </Container>
  );
};

export default DashboardPage;
