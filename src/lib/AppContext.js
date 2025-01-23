import React, { createContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Context Provider component
export const AppContextProvider = ({ children }) => {
  const [currentConvoId, setCurrentConvoId] = useState(null);

  const context = {
    currentConvoId,
    setCurrentConvoId
  }

  return (
    <AppContext.Provider value={context}>
      {children}
    </AppContext.Provider>
  );
};
