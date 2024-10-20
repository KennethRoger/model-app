import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../../pages/Loading";

function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/verify",
          {
            withCredentials: true,
          }
        );
        if (response.data.authenticated) {
          setIsAuthenticated(true);
        } else {
          navigate("/admin/login");
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  if (loading) {
    return <loading />;
  }

  return isAuthenticated ? children : null;
}

export default ProtectedAdminRoute;
