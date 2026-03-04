import { mockUsers } from "../data/mockData.js";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// Module-level store — shared with DataContext via onRegister callback
let _users = [...mockUsers];
let _onRegister = null;

export function setUsersRef(users, onRegister) {
  _users = users;
  _onRegister = onRegister;
}

export const authService = {
  async login(email, password) {
    await delay();
    const user = _users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return { success: false, error: "Invalid email or password." };
    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser };
  },

  async register(data) {
    await delay();
    const exists = _users.find((u) => u.email === data.email);
    if (exists)
      return {
        success: false,
        error: "An account with this email already exists.",
      };

    const newUser = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: "student",
      studentId: `STU-${new Date().getFullYear()}-${String(_users.length).padStart(3, "0")}`,
      avatar: data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      phone: data.phone || "",
      course: data.course || "",
      year: 1,
      joinDate: new Date().toISOString().split("T")[0],
    };

    // Sync to DataContext
    if (_onRegister) _onRegister(newUser);

    const { password: _, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  },
};
