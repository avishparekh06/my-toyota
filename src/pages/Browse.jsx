import React from 'react';
import carsData from '../data/cars.json';
import FilterBar from '../components/FilterBar';
import CarGrid from '../components/CarGrid';

const Browse = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-[84px]">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Browse Toyota Vehicles
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our complete inventory of Toyota vehicles. Filter by body style, fuel type, and more to find your perfect match.
        </p>
      </div>

      {/* Filter and Grid Section */}
      <div className="max-w-7xl mx-auto">
        <FilterBar />
        <CarGrid cars={carsData} />
      </div>
    </div>
  );
};

export default Browse;
