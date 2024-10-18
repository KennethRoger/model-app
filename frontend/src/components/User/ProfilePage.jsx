import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDetails,
  selectUser,
  selectLoading,
  selectError,
} from "../../redux/features/userSlice";
import boyImg from "../../assets/boy.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaCameraRetro } from "react-icons/fa";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put("http://localhost:3000/api/users/me", data, {
        withCredentials: true,
      });
      dispatch(fetchUserDetails());
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profileImage", file);
    await axios.post("http://localhost:3000/api/users/upload", formData, {
      withCredentials: true,
    });
    dispatch(fetchUserDetails());
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-container flex flex-col justify-center items-center">
      <h1>Profile Page</h1>
      {user && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-2 border-gray-300 rounded-lg shadow-md flex flex-col justify-center items-center gap-5 p-8 bg-white max-w-md mx-auto"
        >
          <div className="relative group">
            <img
              src={
                user.profileImage
                  ? `http://localhost:3000${user.profileImage}`
                  : boyImg
              }
              alt="ProfilePic"
              className="h-40 w-40 rounded-full border-4 border-gray-200 object-cover"
            />
            <FaCameraRetro className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 shadow-lg bg-white bg-opacity-70 rounded-md text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2" />
            <input
              type="file"
              className="absolute inset-14 rounded-full cursor-pointer opacity-0 z-50"
              onChange={handleImageUpload}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username:
            </label>
            <input
              {...register("username")}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              {...register("email")}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-500 mb-1">
              Enter your password to update
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              {...register("password")}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
