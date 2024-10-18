import { useEffect, useState } from "react";
import {
  selectUser,
  selectLoading,
  selectError,
  fetchUserDetails,
} from "../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";

function HomePage() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  // const dispatch = useDispatch();

  const [capitalizedName, setCapitalizedName] = useState("");

  // useEffect(() => {
  //   dispatch(fetchUserDetails());
  // }, [dispatch]);

  useEffect(() => {
    if (user && user.username) {
      let capName = user.username[0].toUpperCase() + user.username.slice(1);
      setCapitalizedName(capName);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="flex justify-center items-center h-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Welcome, <span className="text-blue-600">{capitalizedName || "Guest"}</span>
        </h2>
        <p className="text-gray-600">You are now logged in to the home page.</p>
      </div>
    </main>
  );
}

export default HomePage;
