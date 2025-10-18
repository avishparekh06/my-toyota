import React from 'react';

const FilterBar = ({ filters, onFilterChange, onSortChange, sortBy }) => {
  const bodyStyles = ['All', 'Sedan', 'SUV', 'Hatchback', 'Truck', 'Coupe', 'Minivan'];
  const fuelTypes = ['All', 'Gasoline', 'Hybrid', 'Plug-in Hybrid', 'EV'];
  const years = ['All', 2022, 2023, 2024, 2025];
  const states = ['All', 'TX', 'CA', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC'];
  const sortOptions = [
    { value: 'priceAsc', label: 'Price ↑' },
    { value: 'priceDesc', label: 'Price ↓' },
    { value: 'yearAsc', label: 'Year ↑' },
    { value: 'yearDesc', label: 'Year ↓' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Body Style Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body Style
          </label>
          <select
            value={filters.bodyStyle}
            onChange={(e) => onFilterChange('bodyStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB0A1E] focus:border-transparent"
          >
            {bodyStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fuel Type
          </label>
          <select
            value={filters.fuelType}
            onChange={(e) => onFilterChange('fuelType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB0A1E] focus:border-transparent"
          >
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB0A1E] focus:border-transparent"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            value={filters.state}
            onChange={(e) => onFilterChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB0A1E] focus:border-transparent"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB0A1E] focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range: ${filters.priceMin.toLocaleString()} - ${filters.priceMax.toLocaleString()}
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="20000"
            max="80000"
            step="5000"
            value={filters.priceMin}
            onChange={(e) => onFilterChange('priceMin', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <input
            type="range"
            min="20000"
            max="80000"
            step="5000"
            value={filters.priceMax}
            onChange={(e) => onFilterChange('priceMax', parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            onFilterChange('bodyStyle', 'All');
            onFilterChange('fuelType', 'All');
            onFilterChange('year', 'All');
            onFilterChange('state', 'All');
            onFilterChange('priceMin', 20000);
            onFilterChange('priceMax', 80000);
            onSortChange('priceAsc');
          }}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
