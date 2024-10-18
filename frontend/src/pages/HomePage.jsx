import { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });
        if (response.data) {
          let username = response.data.username;
          let capitalizedName = username[0].toUpperCase() + username.slice(1);
          setUsername(capitalizedName);
        }
      } catch (err) {
        console.log("Failed to fetch user: ", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <main className="flex justify-center items-center h-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Welcome, <span className="text-blue-600">{username}</span>
        </h2>
        <p className="text-gray-600">You are now logged in to the home page.</p>
      </div>
    </main>
  );
}

export default HomePage;
