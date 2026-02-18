import { useState, createContext, useContext, useCallback } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const user = localStorage.getItem("user");
    const timestamp = localStorage.getItem("loginTimestamp");

    // Session valid only for 24 hours
    if (user && timestamp) {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (now - parseInt(timestamp) > twentyFourHours) {
        localStorage.removeItem("user");
        localStorage.removeItem("tokenKey");
        localStorage.removeItem("loginTimestamp");
        return {};
      }
      return JSON.parse(user);
    }
    return {};
  });

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const logout = useCallback(() => {
    setUserData({});
    localStorage.removeItem("user");
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("loginTimestamp");
  }, []);

  const isSessionValid = useCallback(() => {
    const user = localStorage.getItem("user");
    const timestamp = localStorage.getItem("loginTimestamp");
    if (!user || !timestamp) return false;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return now - parseInt(timestamp) < twentyFourHours;
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, updateUserData, logout, isSessionValid }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

// eslint-disable-next-line react-refresh/only-export-components
export { useUser };
