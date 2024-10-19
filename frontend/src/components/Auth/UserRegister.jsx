import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

function UserRegister() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    try {
      await axios.post(
        "http://localhost:3000/api/users/register",
        data
      );
      navigate("/auth/login");
    } catch (err) {
      console.error("Error registering user:", err.response.data);
      setErrorMsg(err.response.data.message)
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-300 rounded-lg p-8 w-full max-w-md mx-auto space-y-6 shadow-lg"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
        <p className="text-gray-600">
          Fill in the information below to register
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[A-Za-z][A-Za-z0-9]{3,11}$/,
                message:
                  "Username must start with a letter, be 5-12 characters long, and contain no spaces",
              },
            })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
          />
          <p className="text-red-500">{errors.username?.message}</p>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Email is not valid" },
            })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
          <p className="text-red-500">{errors.email?.message}</p>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
          <p className="text-red-500">{errors.password?.message}</p>
        </div>
      </div>
      <p className="text-red-500 text-center">{errorMsg}</p>
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
      >
        Register
      </button>
      <div className="text-center mt-4">
        <p className="text-gray-600">Already have an account?</p>
        <Link to="/auth/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </form>
  );
}

export default UserRegister;
