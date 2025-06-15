import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import { getCurrentUser, login, logout } from "./API/API";
import { useEffect } from "react";
import DefaultLayout from "./components/DefaultLayout";
import LoginForm from "./components/LoginForm";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeGame from "./components/HomeGame";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");

  // pass it to the form login page
  const handleLogin = async (credentials) => {
    try {
      const loginUser = await login(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${loginUser.email}!`, type: "success" });
      setUser(loginUser);
    } catch (err) {
      setMessage({ msg: err, type: "danger" });
    }
  };

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setMessage("");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route
        element={
          <DefaultLayout
            message={message}
            setMessage={setMessage}
            handleLogout={handleLogout}
            loggedIn={loggedIn}
          />
        }
      >
        <Route path='/' element={<HomeGame loggedIn={loggedIn} />} />
        <Route
          path='login'
          element={
            loggedIn ? (
              <Navigate to='/' />
            ) : (
              <LoginForm handleLogin={handleLogin} />
            )
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
