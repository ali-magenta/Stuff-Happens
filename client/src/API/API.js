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

export { login, logout, getCurrentUser, getCards };
