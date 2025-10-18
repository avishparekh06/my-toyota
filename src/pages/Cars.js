import React, { useState, useMemo } from 'react';
import FilterBar from '../components/FilterBar';
import CarGrid from '../components/CarGrid';
import carsData from '../data/cars.json';

const Cars = () => {
  const [cars] = useState(carsData);
  const [filters, setFilters] = useState({
    bodyStyle: 'All',
    fuelType: 'All',
    year: 'All',
    state: 'All',
    priceMin: 20000,
    priceMax: 80000,
  });
  const [sortBy, setSortBy] = useState('priceAsc');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Crossovers & SUVs',
    'Cars & Minivans',
    'Trucks',
    'Performance',
    'Electrified'
  ];

  // Filter and sort cars based on current filters and category
  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars;

    // Category filtering
    if (activeCategory !== 'All') {
      switch (activeCategory) {
        case 'Crossovers & SUVs':
          filtered = filtered.filter(car => car.bodyStyle === 'SUV');
          break;
        case 'Cars & Minivans':
          filtered = filtered.filter(car => 
            car.bodyStyle === 'Sedan' || 
            car.bodyStyle === 'Hatchback' || 
            car.bodyStyle === 'Minivan'
          );
          break;
        case 'Trucks':
          filtered = filtered.filter(car => car.bodyStyle === 'Truck');
          break;
        case 'Performance':
          filtered = filtered.filter(car => 
            car.model === 'GR Supra' || 
            car.horsepower > 250
          );
          break;
        case 'Electrified':
          filtered = filtered.filter(car => 
            car.fuelType === 'Hybrid' || 
            car.fuelType === 'Plug-in Hybrid' || 
            car.fuelType === 'EV'
          );
          break;
        default:
          break;
      }
    }

    // Apply other filters
    if (filters.bodyStyle !== 'All') {
      filtered = filtered.filter(car => car.bodyStyle === filters.bodyStyle);
    }

    if (filters.fuelType !== 'All') {
      filtered = filtered.filter(car => car.fuelType === filters.fuelType);
    }

    if (filters.year !== 'All') {
      filtered = filtered.filter(car => car.year === parseInt(filters.year));
    }

    if (filters.state !== 'All') {
      filtered = filtered.filter(car => car.location.state === filters.state);
    }

    // Price range filtering
    filtered = filtered.filter(car => 
      car.msrp >= filters.priceMin && car.msrp <= filters.priceMax
    );

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.msrp - b.msrp;
        case 'priceDesc':
          return b.msrp - a.msrp;
        case 'yearAsc':
          return a.year - b.year;
        case 'yearDesc':
          return b.year - a.year;
        default:
          return 0;
      }
    });

    return sorted;
  }, [cars, filters, sortBy, activeCategory]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Build Your Toyota
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Customize your Toyota with colors, options, and accessories to suit your lifestyle.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-[#EB0A1E] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          sortBy={sortBy}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedCars.length} of {cars.length} vehicles
          </p>
        </div>

        {/* Car Grid */}
        <CarGrid cars={filteredAndSortedCars} loading={false} />
      </div>
    </div>
  );
};

export default Cars;
