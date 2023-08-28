import React from 'react';
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import PWAPrompt from "react-ios-pwa-prompt"


function App() {
  
  return (
    <>
      <Header/>
      <Main/>
      <Footer/>
      <PWAPrompt copyTitle="Add to homescreen"/>
    </>
  );
}

export default App;
