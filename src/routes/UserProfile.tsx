import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserUpdateForm from '@/components/UserUpdateForm';
import ProfileSetupWizard from '@/components/ProfileSetupWizard';
import ProfileDisplay from '@/components/ProfileDisplay';
import { Navigate } from 'react-router-dom';
import { isProfileComplete } from '@/utils/profileUtils';

export const UserProfilePage: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [profileComplete, setProfileComplete] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  // Check profile completion when user data changes
  useEffect(() => {
    if (user) {
      const isComplete = isProfileComplete(user);
      setProfileComplete(isComplete);
      setShowWizard(!isComplete);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleWizardComplete = () => {
    setShowWizard(false);
    setProfileComplete(true);
    // Refresh user data to get updated profile
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-[68px]">
      <div>
        {showWizard ? (
          <ProfileSetupWizard onComplete={handleWizardComplete} />
        ) : (
          <ProfileDisplay key={user?.id || 'profile'} />
        )}
      </div>
    </div>
  );
};
