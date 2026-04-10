import {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";

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

  const updateUserData = useCallback((newUserData) => {
    setUserData(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  }, []);

  const logout = useCallback(() => {
    setUserData({});
    localStorage.removeItem("user");
    localStorage.removeItem("tokenKey");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("adminSession"); // Clear admin session on full logout
  }, []);

  const impersonate = useCallback((targetUserData, token) => {
    // Save current admin context
    const currentAdminSession = {
      user: JSON.parse(localStorage.getItem("user")),
      tokenKey: localStorage.getItem("tokenKey"),
      loginTimestamp: localStorage.getItem("loginTimestamp"),
    };
    localStorage.setItem("adminSession", JSON.stringify(currentAdminSession));

    // Set target user context
    setUserData(targetUserData);
    localStorage.setItem("user", JSON.stringify(targetUserData));
    localStorage.setItem("tokenKey", token);
    localStorage.setItem("loginTimestamp", Date.now().toString());
  }, []);

  const stopImpersonating = useCallback(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      const { user, tokenKey, loginTimestamp } = JSON.parse(adminSession);

      // Restore admin context
      setUserData(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenKey", tokenKey);
      localStorage.setItem("loginTimestamp", loginTimestamp);

      // Remove admin session storage
      localStorage.removeItem("adminSession");
      return true;
    }
    return false;
  }, []);

  const isAdminImpersonating = useCallback(() => {
    return !!localStorage.getItem("adminSession");
  }, []);

  const isSessionValid = useCallback(() => {
    const user = localStorage.getItem("user");
    const timestamp = localStorage.getItem("loginTimestamp");
    if (!user || !timestamp) return false;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return now - parseInt(timestamp) < twentyFourHours;
  }, []);

  const contextValue = useMemo(
    () => ({
      userData,
      updateUserData,
      logout,
      isSessionValid,
      impersonate,
      stopImpersonating,
      isAdminImpersonating,
    }),
    [
      userData,
      updateUserData,
      logout,
      isSessionValid,
      impersonate,
      stopImpersonating,
      isAdminImpersonating,
    ],
  );


  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

// eslint-disable-next-line react-refresh/only-export-components
export { useUser };
