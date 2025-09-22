import type { LogsType } from "../../types/logsType";
import { formatDate } from "../../utils/utils";

interface TableLogProps {
  logList: LogsType[];
  isLogPage?: boolean;
}

const TableLogComponent = ({ logList, isLogPage }: TableLogProps) => {
  return (
    <>
      {/* Lista responsiva para Desktop */}
      <div
        className={`${
          isLogPage ? "max-h-[700px]" : "h-full max-h-64"
        } hidden rounded-lg shadow-md overflow-x-auto overflow-y-auto md:block`}
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Data</th>
              <th className="px-4 py-3 text-left font-semibold">Usuário</th>
              <th className="px-4 py-3 text-left font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody>
            {logList.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
            {logList.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-200 border-b border-gray-200 last:border-0 odd:bg-gray-50 even:bg-white"
              >
                <td className="px-4 py-2">
                  {formatDate(log.created_at as Date, "full")}
                </td>
                <td className="px-4 py-2">{log.user_created_action}</td>
                <td className="px-4 py-2">{log.action_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista responsiva para Mobile */}
      <div
        className={`${
          isLogPage ? "h-screen overflow-y-auto" : ""
        } block md:hidden space-y-3`}
      >
        {logList.length === 0 && (
          <div className="p-4 border rounded-lg shadow-sm bg-white text-center">
            <p className="text-sm text-gray-600">Nenhum registro encontrado</p>
          </div>
        )}
        {logList.map((log) => (
          <div
            key={log.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Data:</span>{" "}
              {formatDate(log.created_at as Date, "full")}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Usuário:</span>{" "}
              {log.user_created_action}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Ação:</span>{" "}
              {log.action_description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default TableLogComponent;
