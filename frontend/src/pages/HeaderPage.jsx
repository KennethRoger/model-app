import { useNavigate, Link, Outlet } from "react-router-dom";
import axios from "axios";

function HeaderPage() {
  const navigate = useNavigate();
  const handleLogout = () => {
    axios
      .post(
        "http://localhost:3000/api/users/logout",
        {},
        { withCredentials: true }
      )
      .then(() => {
        navigate("/auth/login");
      })
      .catch((err) => {
        console.error("Logout failed", err);
        navigate("/");
      });
  };
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Home</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
          <Link to={"/profile"} className="relative">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </Link>
        </div>
      </header>
      <div className="h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default HeaderPage;
