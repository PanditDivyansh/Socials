import React, { createContext, useState } from 'react';

export const IDContext = createContext();

export const IDProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  return (
    <IDContext.Provider value={{ userData, setUserData, isLogged, setIsLogged }}>
      {children}
    </IDContext.Provider>
  );
};
