import React, { createContext, useContext, useMemo, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    level: null,          // "primary" | "ol" | "al"
    grade: null,          // "Grade 1"..."Grade 11" or "Grade 12-13"
    stream: null,         // only for AL
    enrolledSubjects: [], // ["maths"]
  });

  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
