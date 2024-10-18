// AdminLogin.jsx
import { useForm } from "react-hook-form";

function AdminLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md mx-auto space-y-6 shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Admin Name
            </label>
            <input
              type="text"
              {...register("adminName", {
                required: "Admin name is required",
              })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin name"
            />
            <p className="text-red-500">{errors.adminName?.message}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Admin ID
            </label>
            <input
              type="text"
              {...register("adminId", {
                required: "Admin ID is required",
              })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter admin ID"
            />
            <p className="text-red-500">{errors.adminId?.message}</p>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            <p className="text-red-500">{errors.password?.message}</p>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-l from-gray-700 via-gray-900 to-black text-white font-bold rounded-md transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-black hover:via-black hover:to-gray-800 hover:scale-105 hover:shadow-lg"
        >
          Login
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;
