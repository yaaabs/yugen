import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import HeroSection from '../components/Hero/HeroSection';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToPortal = () => {
    navigate('/client');
  };

  const handleNavigateToTracker = () => {
    navigate('/track');
  };

  const handleViewDocumentation = () => {
    window.open('https://github.com/yaaabs/yugen#readme', '_blank');
  };

  const handleNavigateToAdmin = () => {
    navigate('/admin');
  };

  const handleViewGitHub = () => {
    window.open('https://github.com/yaaabs/yugen', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onNavigateToPortal={handleNavigateToPortal}
        onNavigateToTracker={handleNavigateToTracker}
        onViewGitHub={handleViewGitHub}
        currentPath="/"
      />
      <main>
        <HeroSection 
          onNavigateToPortal={handleNavigateToPortal}
          onViewDocumentation={handleViewDocumentation}
          onNavigateToAdmin={handleNavigateToAdmin}
          onNavigateToTracker={handleNavigateToTracker}
        />
      </main>
    </div>
  );
};

export default HomePage;