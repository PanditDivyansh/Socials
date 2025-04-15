import React, { createContext, useState, useContext } from 'react';

// Create a Context
const UserContext = createContext();

// Create a provider component to wrap around the app
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const setUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  return useContext(UserContext);
};
