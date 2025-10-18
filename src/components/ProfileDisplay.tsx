import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, User, DollarSign, Car, MapPin, Users, Zap, Palette, Target, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserUpdateForm from './UserUpdateForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileDisplay: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  // Component is working properly now

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center text-[var(--muted)]">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center text-[var(--muted)]">
          <User className="h-12 w-12 mx-auto mb-4 text-[var(--muted)]" />
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              className="flex items-center space-x-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Profile</span>
            </Button>
          </div>
          <UserUpdateForm 
            onSuccess={() => {
              setIsEditing(false);
            }}
            onError={(error) => {
              console.error('Error updating profile:', error);
            }}
          />
        </div>
      </div>
    );
  }

  const personal = user.personal || {};
  const finance = user.finance || {};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return 'Not specified';
    return arr.join(', ');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', position: 'relative' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '24px', position: 'relative', zIndex: 0 }}>
        {/* Header - Simple test */}
        <div style={{
          background: 'linear-gradient(to right, #EB0A1E, #CF0A19)',
          borderRadius: '12px',
          padding: '32px',
          color: 'white',
          marginBottom: '32px',
          boxShadow: '0 6px 20px rgba(16,24,40,.06)',
          position: 'relative',
          zIndex: 10,
          width: '100%',
          display: 'block'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '8px', margin: 0, paddingBottom: '8px' }}>
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
                Your Toyota profile is ready to help you find the perfect match.
              </p>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full bg-[var(--card)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <span className="text-[var(--text)]">Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4 text-[var(--muted)]" />
                      <div>
                        <p className="text-sm text-[var(--muted)]">Family Size</p>
                        <p className="font-medium text-[var(--text)]">
                          {personal.familyInfo ? `${personal.familyInfo} members` : 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-[var(--muted)]" />
                      <div>
                        <p className="text-sm text-[var(--muted)]">Commute Distance</p>
                        <p className="font-medium text-[var(--text)]">
                          {personal.avgCommuteDistance ? `${personal.avgCommuteDistance} miles` : 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-[var(--muted)]" />
                      <div>
                        <p className="text-sm text-[var(--muted)]">Location</p>
                        <p className="font-medium text-[var(--text)]">
                          {personal.location || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Target className="w-4 h-4 text-[var(--muted)]" />
                      <div>
                        <p className="text-sm text-[var(--muted)]">Buying For</p>
                        <p className="font-medium text-[var(--text)]">
                          {personal.buyingFor || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border)] pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[var(--muted)] mb-1">Fuel Type</p>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-[var(--muted)]" />
                          <span className="font-medium text-[var(--text)]">
                            {personal.fuelType || 'Not specified'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-[var(--muted)] mb-1">Preferred Color</p>
                        <div className="flex items-center space-x-2">
                          <Palette className="w-4 h-4 text-[var(--muted)]" />
                          <span className="font-medium text-[var(--text)]">
                            {personal.color || 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {personal.year && (
                      <div className="mt-4">
                        <p className="text-sm text-[var(--muted)] mb-1">Preferred Year</p>
                        <span className="font-medium text-[var(--text)]">{personal.year}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Financial Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full bg-[var(--card)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <span className="text-[var(--text)]">Financial Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[var(--muted)] mb-1">Household Income</p>
                      <p className="font-medium text-[var(--text)]">
                        {finance.householdIncome ? formatCurrency(finance.householdIncome) : 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[var(--muted)] mb-1">Credit Score</p>
                      <p className="font-medium text-[var(--text)]">
                        {finance.creditScore ? finance.creditScore : 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[var(--muted)] mb-1">Finance or Lease</p>
                      <p className="font-medium text-[var(--text)]">
                        {finance.financeOrLease || 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-[var(--muted)] mb-1">Employment Status</p>
                      <p className="font-medium text-[var(--text)]">
                        {finance.employmentStatus || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  {finance.financingPriorities && finance.financingPriorities.length > 0 && (
                    <div className="border-t border-[var(--border)] pt-4">
                      <p className="text-sm text-[var(--muted)] mb-2">Financing Priority</p>
                      <span className="bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full text-sm font-medium">
                        {finance.financingPriorities[0] === 'Downpayment' ? 'Low Down Payment' : finance.financingPriorities[0]}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vehicle Preferences Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-[var(--card)] border-[var(--border)] shadow-[var(--shadow)] rounded-xl hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <span className="text-[var(--text)]">Vehicle Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-[var(--muted)] mb-3">Feature Preferences</p>
                    <div className="space-y-2">
                      {personal.featurePreferences && personal.featurePreferences.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {personal.featurePreferences.map((feature, index) => (
                            <span
                              key={index}
                              className="inline-block bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[var(--muted)] text-sm">No preferences specified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--muted)] mb-3">Build Preferences</p>
                    <div className="space-y-2">
                      {personal.buildPreferences && personal.buildPreferences.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {personal.buildPreferences.map((build, index) => (
                            <span
                              key={index}
                              className="inline-block bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {build}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[var(--muted)] text-sm">No preferences specified</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-[var(--muted)] mb-3">Model Preferences</p>
                    <div className="space-y-2">
                      {personal.modelPreferences && personal.modelPreferences.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {personal.modelPreferences.map((model, index) => (
                            <span
                              key={index}
                              className="inline-block bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {model}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[var(--muted)] text-sm">No preferences specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex justify-center space-x-4"
        >
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[var(--accent)] hover:bg-[var(--accent-600)] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Button>
          
          <Button 
            variant="outline"
            className="border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Car className="w-4 h-4" />
            <span>Find My Toyota</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
