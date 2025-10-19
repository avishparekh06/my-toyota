import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  msrp: number;
  dealerPrice: number;
  bodyStyle: string;
  engine: string;
  mpgCity: number;
  mpgHighway: number;
  drivetrain: string;
  fuelType: string;
  status: string;
  images?: string[];
  location: {
    city: string;
    state: string;
  };
  dealership?: {
    name: string;
    city: string;
    state: string;
  };
}

interface CarContextType {
  selectedCar: Car | null;
  setSelectedCar: (car: Car | null) => void;
  clearSelectedCar: () => void;
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const useCar = () => {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCar must be used within a CarProvider');
  }
  return context;
};

interface CarProviderProps {
  children: ReactNode;
}

export const CarProvider: React.FC<CarProviderProps> = ({ children }) => {
  const [selectedCar, setSelectedCarState] = useState<Car | null>(null);

  // Load selected car from localStorage on mount
  useEffect(() => {
    const savedCar = localStorage.getItem('selectedCar');
    if (savedCar) {
      try {
        setSelectedCarState(JSON.parse(savedCar));
      } catch (error) {
        console.error('Error loading saved car:', error);
        localStorage.removeItem('selectedCar');
      }
    }
  }, []);

  // Save selected car to localStorage whenever it changes
  useEffect(() => {
    if (selectedCar) {
      localStorage.setItem('selectedCar', JSON.stringify(selectedCar));
    } else {
      localStorage.removeItem('selectedCar');
    }
  }, [selectedCar]);

  const setSelectedCar = (car: Car | null) => {
    setSelectedCarState(car);
  };

  const clearSelectedCar = () => {
    setSelectedCarState(null);
    localStorage.removeItem('selectedCar');
  };

  const value: CarContextType = {
    selectedCar,
    setSelectedCar,
    clearSelectedCar,
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
};
