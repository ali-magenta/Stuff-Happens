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

export {
  login,
  logout,
  getCurrentUser,
  getCards,
  getcardRound,
  getIndexSelected,
};
