import React, { useState } from 'react';
import NavBar from './components/NavBar';
import HeroSection from './components/HeroSection';
import InfoSection from './components/InfoSection';
import PlanSimulator from './components/PlanSimulator';
import RecommendationTest from './components/RecommendationTest';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <HeroSection />
            <InfoSection />
          </>
        );
      case 'plan-simulator':
        return <PlanSimulator />;
      case 'recommendations':
        return <RecommendationTest />;
      default:
        return (
          <>
            <HeroSection />
            <InfoSection />
          </>
        );
    }
  };

  return (
    <div className="App">
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;
