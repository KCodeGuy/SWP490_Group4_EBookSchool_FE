export const loginUser = async ({ username, password }) => {
  const response = await fetch("http://localhost:1000/api/Auth/Login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  return data;
};

export const logoutUser = () => {
  localStorage.clear();
};
