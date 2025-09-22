import { useState } from "react";
import AsideMenu from "../asideMenu";
/* import "./containerStyles.css"; */
import type UserResponseProps from "../../types/userResponseType";
import { TokenTimer } from "../tokentimer";

const Container = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem("currentUser");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;
  const [currentUser] = useState<UserResponseProps>(initialUser);
  return (
    <div className="flex flex-col h-screen overflow-auto px-5 w-full md:flex-row">
      <AsideMenu />
      <main className="flex-1 md:ml-64">
        {currentUser?.token && <TokenTimer token={currentUser.token} />}
        {children}
      </main>
    </div>
  );
};

export default Container;
