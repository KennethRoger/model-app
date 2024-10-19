import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("email", user.email);
      if (user.profileImage) {
        setImage(user.profileImage);
        setPreview(`http://localhost:3000${user.profileImage}`);
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put("http://localhost:3000/api/users/me", data, {
        withCredentials: true,
      });
      if (image != user.profileImage) {
        await axios.post("http://localhost:3000/api/users/upload", image, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
      }
      dispatch(fetchUserDetails());
      navigate("/");
    } catch (err) {
      console.error("Error updating profile:", err.response);
      setErrorMsg(err.response.data.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      console.log(formData);
      setImage(formData);
      setPreview(URL.createObjectURL(file));
      console.log(URL.createObjectURL(file));
    }
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
              src={preview || boyImg}
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
              type="email"
              {...register("email", {
                pattern: { value: /^\S+@\S+$/i, message: "Email is not valid" },
              })}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>
          <div className="w-full">
            <p className="text-blue-400 text-lg mb-1 font-bold">
              Enter your password to update
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password:
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-red-500">{errors.password?.message}</p>
          </div>
          <p className="text-red-500">{errorMsg}</p>
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
