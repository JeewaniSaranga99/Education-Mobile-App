import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { BookProvider } from './src/context/BookContext';
const App = () => {
  return (
    <BookProvider>
      <AppNavigator />
    </BookProvider>
  );
};

export default App;