import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};

type TokenTimerProps = {
  token: string;
};

export function TokenTimer({ token }: TokenTimerProps) {
  const [remainingMs, setRemainingMs] = useState<number>(0);

  useEffect(() => {
    function calculateRemaining() {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const exp = decoded.exp * 1000; // ms
        const now = Date.now();
        return Math.max(exp - now, 0);
      } catch {
        return 0;
      }
    }

    setRemainingMs(calculateRemaining());

    const interval = setInterval(() => {
      setRemainingMs(calculateRemaining());
    }, 1000); // atualiza a cada segundo

    return () => clearInterval(interval);
  }, [token]);

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);

  return (
    <div className="font-bold flex justify-end mr-5 mb-5">
      Sessão expira em: {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}
