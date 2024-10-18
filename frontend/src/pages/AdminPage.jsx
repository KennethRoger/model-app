import { Outlet } from "react-router-dom";

function AdminPage() {
  return (
    <>
    <header className="shadow-md p-5 bg-gray-900 text-gray-200">
      <h1 className=" text-white text-2xl">Orphius</h1>
    </header>
      <Outlet />
    </>
  );
}

export default AdminPage;
