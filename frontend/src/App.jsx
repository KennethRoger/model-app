import { Routes, Route } from "react-router-dom";
import UserAuthPage from "./pages/UserAuthPage";
import UserRegister from "./components/Auth/UserRegister";
import UserLogin from "./components/Auth/UserLogin";
import AdminLogin from "./components/Auth/AdminLogin";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProfilePage from "./components/User/ProfilePage";
import RedirectIfAuthenticated from "./components/Auth/RedirectIfAuthenticated";
import HeaderPage from "./pages/HeaderPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedAdminRoute from "./components/Auth/ProtectedAdminRoute";
import { useState } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import RedirectIfAdminAuthenticated from "./components/Auth/RedirectIfAdminAuthenticated";

function App() {
  const [adminName, setAdminName] = useState("X");

  const adminNameProvider = (name) => {
    setAdminName(name);
  };

  return (
    <Routes>
      <Route
        path="/auth/login"
        element={
          <RedirectIfAuthenticated>
            <UserAuthPage>
              <UserLogin />
            </UserAuthPage>
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/auth/register"
        element={
          <RedirectIfAuthenticated>
            <UserAuthPage>
              <UserRegister />
            </UserAuthPage>
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HeaderPage />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route
        path="/admin/login"
        element={
          <RedirectIfAdminAuthenticated>
            <AdminLogin adminNameProvider={adminNameProvider} />
          </RedirectIfAdminAuthenticated>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard adminName={adminName} />
          </ProtectedAdminRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
