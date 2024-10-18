import { Routes, Route } from "react-router-dom";
import UserAuthPage from "./pages/UserAuthPage";
import UserRegister from "./components/Auth/UserRegister";
import UserLogin from "./components/Auth/UserLogin";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./components/Auth/AdminLogin";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProfilePage from "./components/User/ProfilePage";
import RedirectIfAuthenticated from "./components/Auth/RedirectIfAuthenticated";
import HeaderPage from "./pages/HeaderPage";

function App() {
  return (
    <>
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
        <Route path="/admin" element={<AdminPage />}>
          <Route path="login" element={<AdminLogin />} />
        </Route>
        <Route
          path="*"
          element={<h1>Thyis pyage yis nyot avyailable nya~</h1>}
        />
      </Routes>
    </>
  );
}

export default App;
