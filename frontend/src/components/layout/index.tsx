import { Outlet } from "react-router-dom";
/* import "./layout.css"; */
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <main className="flex-1 h-screen">
      <div className="h-full">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
