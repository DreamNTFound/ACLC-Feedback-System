const users = [
  {
    id: 1,
    usn: "12345678",
    name: "Guest",
    role: "student",
  },
  {
    id: 2,
    usn: "admin",
    password: "admin123",
    name: "Admin",
    role: "admin",
  },
];

export const authService = {
  login: async (usn, password, role) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (role === "admin") {
          const user = users.find(
            (u) =>
              u.usn === usn.trim() &&
              u.password === password.trim() &&
              u.role === "admin",
          );
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            resolve(user);
          } else {
            console.log("Login Failed");
            alert("Invalid USN or password");
            reject(new Error("Invalid USN or password"));
          }
        } else if (role === "student") {
          const user = users.find(
            (u) => u.usn === usn.trim() && u.role === "student",
          );
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            resolve(user);
          } else {
            console.log("Login Failed");
            alert("Invalid USN");
            reject(new Error("Invalid USN"));
          }
        }
      }, 800);
    });
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("user");
  },
};
