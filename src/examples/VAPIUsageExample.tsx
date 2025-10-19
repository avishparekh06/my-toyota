// Example usage of VAPI service in a React component
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import VAPICallButton from '@/components/VAPICallButton';
import { CarContext } from '@/services/vapiService';

// Example car data - this would typically come from your car selection/API
const exampleCar: CarContext = {
  make: 'Toyota',
  model: 'Camry',
  color: 'White',
  year: 2024,
  price: 28000,
  financingOption: 'Finance'
};

const VAPIUsageExample: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Please log in to use VAPI calling feature.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">VAPI Call Example</h2>
      
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Car Details:</h3>
        <p><strong>Vehicle:</strong> {exampleCar.year} {exampleCar.make} {exampleCar.model}</p>
        <p><strong>Color:</strong> {exampleCar.color}</p>
        <p><strong>Price:</strong> ${exampleCar.price?.toLocaleString()}</p>
        <p><strong>Financing:</strong> {exampleCar.financingOption}</p>
      </div>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Customer Info:</h3>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
        {user.location && (
          <p><strong>Location:</strong> {user.location.city}, {user.location.state}</p>
        )}
      </div>

      <VAPICallButton
        user={user}
        car={exampleCar}
        showStatus={true}
        onCallStarted={(callId) => {
          console.log('Call started:', callId);
        }}
        onCallCompleted={(callId, status) => {
          console.log('Call completed:', callId, status);
        }}
        onError={(error) => {
          console.error('Call error:', error);
        }}
      />

      <div className="mt-4 text-xs text-gray-600">
        <p><strong>Context that will be injected:</strong></p>
        <ul className="list-disc list-inside ml-2 mt-1">
          <li>First name: {user.firstName}</li>
          <li>Last name: {user.lastName}</li>
          <li>Car color: {exampleCar.color}</li>
          <li>Car make: {exampleCar.make}</li>
          <li>Car model: {exampleCar.model}</li>
          <li>Car year: {exampleCar.year}</li>
          <li>Financing option: {exampleCar.financingOption}</li>
        </ul>
      </div>
    </div>
  );
};

export default VAPIUsageExample;
