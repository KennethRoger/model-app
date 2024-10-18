import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function UserLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        data,
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/");
      }
    } catch (err) {
      console.error("Error logging in:", err.response.data);
      setErrorMessage(
        err.response.data.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md mx-auto space-y-6 shadow-lg"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Login to Your Account</h2>
        <p className="text-gray-600">Fill in your credentials to login</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            {...register("username", { required: "Username is required" })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            placeholder="Enter your username"
          />
          <p className="text-red-500">{errors.username?.message}</p>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            placeholder="Enter your password"
          />
          <p className="text-red-500">{errors.password?.message}</p>
        </div>
      </div>
      {errorMessage && (
        <div className="text-red-500 text-center">
          <p>{errorMessage}</p>
        </div>
      )}
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
      >
        Login
      </button>
      <div className="text-center mt-4">
        <p className="text-gray-600">Don't have an account?</p>
        <Link to="/auth/register" className="text-blue-500 hover:underline">
          Register
        </Link>
      </div>
    </form>
  );
}

export default UserLogin;
