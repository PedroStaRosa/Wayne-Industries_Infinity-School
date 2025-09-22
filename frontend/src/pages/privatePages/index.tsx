import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoLogout } from "../../helpers/autoLogout";
import type UserResponseProps from "../../types/userResponseType";
import { toast } from "react-toastify";

const PrivateRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: (user: UserResponseProps) => React.ReactElement;
}) => {
  const navigate = useNavigate();
  const [initialUser, setInitialUser] = useState<UserResponseProps | null>(
    null
  );
  useAutoLogout();
  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem("currentUser");
      const user = stored ? JSON.parse(stored) : null;

      if (!user) {
        toast.error("Usuário não autenticado", {
          autoClose: 2000,
        });

        // espera o toast fechar antes de redirecionar
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
        return null;
      }

      if (!allowedRoles.includes(user.role)) {
        toast.error("Acesso não autorizado");
        navigate("/", { replace: true });

        return null;
      }

      return user;
    };

    const user = checkAuth();
    if (user) setInitialUser(user);
  }, [allowedRoles, navigate]);
  /*   useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    if (!initialUser) {
      toast.error("Usuario não autenticado");
      navigate("/", { replace: true });
    } else if (!allowedRoles.includes(initialUser.role)) {
      alert("Acesso nao autorizado");
      navigate("/", { replace: true });
    } else {
      setInitialUser(initialUser);
    }
  }, [allowedRoles, navigate]) */ if (!initialUser) return null;

  return children(initialUser) as React.ReactElement;
};

export default PrivateRoute;
