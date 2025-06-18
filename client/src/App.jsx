import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router";
import { getCurrentUser, login, logout } from "./API/API";
import { useEffect } from "react";
import DefaultLayout from "./components/DefaultLayout";
import LoginForm from "./components/LoginForm";
import "bootstrap/dist/css/bootstrap.min.css";
import HomeGame from "./components/HomeGame";
import Game from "./components/Game";
import UserProfile from "./components/UserProfile";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [game, setGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [gameId, setGameId] = useState(0);
  const [startRequested, setStartRequested] = useState(false);

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
    <>
      {loading ? (
        <div>...page loading...</div>
      ) : (
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
            <Route
              path='/'
              element={
                <HomeGame
                  loggedIn={loggedIn}
                  game={game}
                  setGame={setGame}
                  user={user}
                  cards={cards}
                  setCards={setCards}
                  gameId={gameId}
                  setGameId={setGameId}
                  startRequested={startRequested}
                  setStartRequested={setStartRequested}
                />
              }
            />
            <Route
              path='game/:gameId'
              element={
                <Game
                  loggedIn={loggedIn}
                  game={game}
                  setGame={setGame}
                  user={user}
                  cards={cards}
                  setCards={setCards}
                  gameId={gameId}
                  setGameId={setGameId}
                  startRequested={startRequested}
                  setStartRequested={setStartRequested}
                />
              }
            />
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
            <Route
              path='user/profile'
              element={<UserProfile loggedIn={loggedIn} user={user} />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
