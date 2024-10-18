import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/verify",
          {
            withCredentials: true,
          }
        );
        if (response.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          navigate("/auth/login");
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        navigate("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
