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
import { getCards, createGame } from "./API/API";
import dayjs from "dayjs";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [game, setGame] = useState(false);
  const [cards, setCards] = useState([]);
  const [gameId, setGameId] = useState(0);

  const navigate = useNavigate();

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
      try {
        const user = await getCurrentUser();
        setLoggedIn(true);
        setUser(user);
      } catch (error) {
        setLoggedIn(false);
        setUser({});
      }
    };
    checkAuth();
  }, []);

  const handleStart = async () => {
    setGame(true); // Reset game state
    const c = await getCards();
    setCards(c);

    let newGameId = -1;

    if (loggedIn) {
      const [card1, card2, card3] = [...c];
      const currGame = {
        outcome: "in progress",
        card1: card1?.id,
        card2: card2?.id,
        card3: card3?.id,
        gameDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      };
      const game = await createGame(currGame, user.id);
      newGameId = game.gameId;
    }

    setGameId(newGameId);
    navigate("/game/" + newGameId);
  };

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
        <Route path='/' element={<HomeGame handleStart={handleStart} />} />
        <Route
          path='game/:gameId'
          element={
            <Game
              key={gameId}
              loggedIn={loggedIn}
              game={game}
              setGame={setGame}
              cards={cards}
              setCards={setCards}
              handleRestart={handleStart}
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
          element={loggedIn ? <UserProfile user={user} /> : <Navigate to='/' />}
        />
      </Route>
    </Routes>
  );
}

export default App;
