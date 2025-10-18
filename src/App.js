import React from 'react';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import InfoSection from './components/InfoSection';
import './index.css';

function App() {
  return (
    <div className="App">
      <NavBar />
      <HeroSection />
      <InfoSection />
    </div>
  );
}

export default App;
