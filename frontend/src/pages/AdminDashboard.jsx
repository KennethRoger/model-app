import { useState, useEffect } from "react";
import axios from "axios";
import {
  fetchEveryUserDetails,
  selectUsers,
  selectLoading,
  selectError,
} from "../redux/features/everyUserSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalComponent from "./ModalComponent";
import { useForm } from "react-hook-form";
import boyImg from "../assets/boy.png";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import ErrorPage from "../Error";

const AdminDashboard = ({ adminName }) => {
  const users = useSelector(selectUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    dispatch(fetchEveryUserDetails()).then((response) => {
      console.log("Fetched users:", response);
    });
  }, [dispatch]);

  const openModal = (action, userId = null) => {
    setModalContent(action);
    setSelectedUserId(userId);
    setModalIsOpen(true);

    if (action === "Edit" && userId) {
      const user = users.find((u) => u._id === userId);
      setSelectedUser(user);
      if (user) {
        setValue("username", user.username);
        setValue("email", user.email);
        setValue("password", "");
      }
    } else {
      setSelectedUser(null);
      setValue("username", "");
      setValue("email", "");
      setValue("password", "");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent("");
    setSelectedUserId(null);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      await axios.delete(
        `http://localhost:3000/api/admin/users/${selectedUserId}`,
        {
          withCredentials: true,
        }
      );
      dispatch(fetchEveryUserDetails());
      closeModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const onEditSubmit = async (data) => {
    if (!selectedUserId) return;
    try {
      await axios.put(
        `http://localhost:3000/api/admin/users/${selectedUserId}`,
        data,
        {
          withCredentials: true,
        }
      );
      dispatch(fetchEveryUserDetails());
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios
        .post("http://localhost:3000/api/users/register", data)
        .then((res) => console.log(res));
      closeModal();
      dispatch(fetchEveryUserDetails());
    } catch (err) {
      console.error("Error registering user:", err.response.data);
      setErrorMsg(err.response.data.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const logoutAdmin = async () => {
    await axios
      .post(
        "http://localhost:3000/api/admin/logout",
        {},
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        navigate("/admin/login");
      })
      .catch((err) => {
        console.error("Logout failed", err);
        navigate("/admin/dashboard");
      });
  };

  if (loading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <>
      <header className="shadow-md p-5 bg-gray-900 text-gray-200 flex justify-between">
        <h1 className="text-white text-2xl">Admin</h1>
        <button
          className="bg-yellow-500 px-3 py-2 rounded-lg text-white hover:bg-yellow-600"
          onClick={logoutAdmin}
        >
          logout
        </button>
      </header>
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome, {adminName}</p>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">User Management</h2>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded-md mr-4"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={() => openModal("Add")}
            >
              Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Si.No</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2 flex justify-center">
                      <img
                        src={
                          user && user.profileImage
                            ? `http://localhost:3000${user.profileImage}`
                            : boyImg
                        }
                        alt="User"
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="border p-2 text-center">{user.username}</td>
                    <td className="border p-2 text-center">{user.email}</td>
                    <td className="border p-2 text-center">
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded-md mr-2 hover:bg-green-600"
                        onClick={() => openModal("Edit", user._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                        onClick={() => openModal("Delete", user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center mt-4 text-gray-500">No users found.</p>
            )}
          </div>
        </div>
      </main>
      <ModalComponent
        isOpen={modalIsOpen}
        onClose={closeModal}
        title={`${modalContent} User`}
      >
        {modalContent === "Add" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border-gray-300 w-full max-w-md mx-auto space-y-6"
          >
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
                  placeholder="Enter username"
                />
                <p className="text-red-500">{errors.username?.message}</p>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email is not valid",
                    },
                  })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
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
                  placeholder="Enter password"
                />
                <p className="text-red-500">{errors.password?.message}</p>
              </div>
            </div>
            <p className="text-red-500 text-center">{errorMsg}</p>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
            >
              Add user
            </button>
          </form>
        )}
        {modalContent === "Edit" && (
          <form
            onSubmit={handleSubmit(onEditSubmit)}
            className="flex flex-col justify-center items-center gap-5 max-w-md mx-auto"
          >
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username:
              </label>
              <input
                {...register("username", {
                  pattern: {
                    value: /^[A-Za-z][A-Za-z0-9]{3,11}/,
                    message:
                      "Username must start with a letter, be 5-12 characters long, and contain no spaces",
                  },
                })}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-red-500">{errors.username?.message}</p>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                {...register("email", {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-red-500">{errors.email?.message}</p>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password:
              </label>
              <input
                {...register("password", {
                  pattern: {
                    value: /^.{6,}$/,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-red-500">{errors.password?.message}</p>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {modalContent === "Delete" && (
          <div className="p-4">
            <p>Are you sure you want to delete this user?</p>
            <p className="text-red-500 mt-2 font-bold">This action is irreversible</p>
            <div className="flex justify-end space-x-4 mt-5">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </ModalComponent>
    </>
  );
};

export default AdminDashboard;
