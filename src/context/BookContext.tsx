import React, { createContext, useContext, useState } from 'react';

interface BookContextType {
  clickCount: number;
  incrementCount: () => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clickCount, setClickCount] = useState(0);

  const incrementCount = () => {
    setClickCount((prev) => prev + 1);
  };

  return (
    <BookContext.Provider value={{ clickCount, incrementCount }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (undefined === context) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};