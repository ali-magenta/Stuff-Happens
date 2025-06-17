const URI = "http://localhost:3001/api";

// login
async function login(credentials) {
  const bodyObject = {
    email: credentials.email,
    password: credentials.password,
  };

  const response = await fetch(URI + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(bodyObject),
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const err = await response.text();
    throw err;
  }
}

// logout
async function logout() {
  const response = await fetch(URI + "/logout", {
    method: "POST",
    credentials: "include",
  });
  if (response.ok) {
    return null;
  }
}

// user for authentication
async function getCurrentUser() {
  const response = await fetch(URI + "/session/current", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }
  return response.json();
}

// get first three cards
async function getCards() {
  try {
    const response = await fetch(URI + "/cards");
    if (response.ok) {
      const cards = await response.json();
      return cards;
    } else {
      throw new Error("Application error in getCards");
    }
  } catch (err) {
    throw new Error("Network error in getCards " + err);
  }
}

// get card for round
async function getcardRound() {
  try {
    const response = await fetch(URI + "/card");
    if (response.ok) {
      const card = await response.json();
      return card;
    } else {
      throw new Error("Application error in getCardRound");
    }
  } catch (err) {
    throw new Error("Network error in getCardRound " + err);
  }
}

// get index of selected card
async function getIndexSelected(id) {
  try {
    const response = await fetch(`${URI}/card/${id}/index`);
    if (response.ok) {
      const index = await response.json();
      return index;
    } else {
      throw new Error("Application error in getIndexSelected");
    }
  } catch (err) {
    throw new Error("Network error in getIndexSelected " + err);
  }
}

async function addRound(round) {
  const response = await fetch(URI + `/game/round`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      outcome: round.outcome,
      roundNumber: round.routeNumber,
      cardId: round.card.id,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    let errMessage = await response.json();
    if (response.status === 422)
      errMessage = `${errMessage.errors[0].msg} for ${errMessage.errors[0].path}.`;
    else errMessage = errMessage.error;
    throw errMessage;
  } else return null;
}

async function addGame(game, userId) {
  const response = await fetch(URI + `/${userId}/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      outcome: game.outcome,
      userId: userId,
      card1: game.card1,
      card2: game.card2,
      card3: game.card3,
      gameDate: game.gameDate,
      round1: game.round1,
      round2: game.round2,
      round3: game.round3,
      round4: game.round4,
      round5: game.round5,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    let errMessage = await response.json();
    if (response.status === 422)
      errMessage = `${errMessage.errors[0].msg} for ${errMessage.errors[0].path}.`;
    else errMessage = errMessage.error;
    throw errMessage;
  } else return null;
}

export {
  login,
  logout,
  getCurrentUser,
  getCards,
  getcardRound,
  getIndexSelected,
  addRound,
  addGame,
};
