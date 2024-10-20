import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import Loading from "../../pages/Loading";

function RedirectIfAdminAuthenticated({ children }) {
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
          navigate("/admin/dashboard");
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }

  return !isAuthenticated ? children : null;
}

export default RedirectIfAdminAuthenticated;
