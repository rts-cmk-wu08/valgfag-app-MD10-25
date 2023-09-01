import React from 'react';
import Header from './components/Header'
import Main from './components/Main'
import PWAPrompt from "react-ios-pwa-prompt"


function App() {
  
  return (
    <div className="flex flex-col h-screen">
      <Header/>
      <Main/>
      <PWAPrompt copyTitle="Add to homescreen"/>
    </div>
  );
}

export default App;
