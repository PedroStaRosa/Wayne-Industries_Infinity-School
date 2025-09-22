import type { LogsType } from "../types/logsType";
import type { ResourceCreateType } from "../types/resourceCreateType";
import type { ResourceProps } from "../types/resourcesType";
import type UserType from "../types/userType";
import {
  API_URL_LOGIN,
  API_URL_RESOURCES,
  API_URL_CREATE_USER,
  API_URL_LOGS,
  API_URL_USER,
} from "./apiUrls";

const login = async (email: string, password: string) => {
  try {
    const response = await fetch(API_URL_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return { data, status: response.status };
  } catch {
    throw new Error("Falha ao logar");
  }
};

const fetchResourses = async (userToken: string): Promise<ResourceProps[]> => {
  try {
    const response = await fetch(API_URL_RESOURCES, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await response.json();

    const parsedResources = data.resources.map(
      (resourceItem: ResourceProps) => {
        if (resourceItem.updated_at === null) {
          return {
            ...resourceItem,
            created_at: new Date(resourceItem.created_at),
            updated_at: null,
          };
        }
        return {
          ...resourceItem,
          created_at: new Date(resourceItem.created_at),
          updated_at: new Date(resourceItem.updated_at),
        };
      }
    );

    return parsedResources;
  } catch {
    throw new Error("Falha ao buscar recursos");
  }
};

const deleteResources = async (userToken: string, id: string) => {
  try {
    const response = await fetch(`${API_URL_RESOURCES}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.msg);
    }
    return {
      status: true,
      msg: data.msg,
    };
  } catch (error) {
    return {
      status: false,
      msg: error instanceof Error ? error.message : "Falha ao criar recurso",
    };
  }
};

const create_user = async (user: UserType, userToken: string) => {
  try {
    const response = await fetch(API_URL_CREATE_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },

      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.msg);
    }
    return { status: true, msg: data.msg };
  } catch (error) {
    return {
      status: false,
      msg: error instanceof Error ? error.message : "Falha ao criar recurso",
    };
  }
};

const fetchAllUsers = async (userToken: string) => {
  try {
    const response = await fetch(API_URL_USER, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await response.json();
    return data.users;
  } catch {
    throw new Error("Falha ao buscar usuarios");
  }
};

const updateRoleUser = async (
  userId: string,
  newRole: string,
  userToken: string
) => {
  try {
    const response = await fetch(API_URL_USER, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ userId, newRole }),
    });

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.msg);
    }
    return data;
  } catch (error) {
    return {
      status: false,
      msg:
        error instanceof Error ? error.message : "Falha ao atualizar usuario",
    };
  }
};

const deleteUser = async (userToken: string, id: string) => {
  try {
    const response = await fetch(`${API_URL_USER}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.msg);
    }
    return data;
  } catch (error) {
    return {
      status: false,
      msg: error instanceof Error ? error.message : "Falha ao remover usuario",
    };
  }
};

const new_resource = async (
  resource: ResourceCreateType,
  userToken: string
) => {
  try {
    const response = await fetch(API_URL_RESOURCES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },

      body: JSON.stringify({ ...resource }),
    });

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.msg);
    }
    return { status: true, msg: data.msg };
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return {
        status: false,
        msg: "Servidor indisponível. Tente novamente mais tarde.",
      };
    }

    return {
      status: false,
      msg: error instanceof Error ? error.message : "Falha ao criar recurso",
    };
  }
};

const update_resource = async (resource: ResourceProps, userToken: string) => {
  try {
    const response = await fetch(`${API_URL_RESOURCES}/${resource.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },

      body: JSON.stringify({ ...resource }),
    });

    const data = await response.json();
    if (response.status >= 400) {
      throw new Error(data.msg);
    }
    return { status: true, msg: data.msg };
  } catch (error) {
    return {
      status: false,
      msg:
        error instanceof Error ? error.message : "Falha ao atuliazar recurso",
    };
  }
};

const fetchDashboardLogs = async (
  userToken: string,
  limit?: number
): Promise<LogsType[]> => {
  try {
    let query = `${API_URL_LOGS}`;
    if (limit) {
      query += `?limit=${limit}`;
    }
    const response = await fetch(query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await response.json();

    const parsedLogs = data.map((logItem: LogsType) => {
      return {
        ...logItem,
        created_at: new Date(logItem.created_at),
      };
    });

    return parsedLogs;
  } catch {
    throw new Error("Falha ao logs");
  }
};

export const api = {
  login,
  fetchResourses,
  deleteResources,
  new_resource,
  create_user,
  fetchAllUsers,
  updateRoleUser,
  deleteUser,
  update_resource,
  fetchDashboardLogs,
};
