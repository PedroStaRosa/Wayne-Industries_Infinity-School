import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

type JwtPayload = {
  exp: number;
};

function getTokenRemainingTime(token: string): number {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const exp = decoded.exp * 1000; // converte para ms
    const now = Date.now();

    return exp - now;
  } catch {
    return 0;
  }
}

export function useAutoLogout(warningTimeMs = 2 * 60 * 1000) {
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const { token } = JSON.parse(currentUser);

    if (!token) return;

    const remainingTime = getTokenRemainingTime(token);

    if (remainingTime <= 0) {
      // token já expirou
      localStorage.removeItem("currentUser");
      navigate("/");
      return;
    }

    if (remainingTime > warningTimeMs) {
      const warningTimeout = setTimeout(() => {
        toast.warn(
          `Sua sessão expira em ${Math.floor(
            warningTimeMs / 60000
          )} minuto(s).`,
          { autoClose: 3000 }
        );
      }, remainingTime - warningTimeMs);

      return () => clearTimeout(warningTimeout);
    }

    // define timeout para auto logout
    const timeout = setTimeout(() => {
      localStorage.removeItem("currentUser");
      navigate("/");
      toast.info("Sua sessão expirou. Faça login novamente.");
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, [navigate]);
}
