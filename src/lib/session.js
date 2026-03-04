export function getStoredSession() {
  try {
    const saved = localStorage.getItem("shms_session");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem("shms_session", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("shms_session");
}
