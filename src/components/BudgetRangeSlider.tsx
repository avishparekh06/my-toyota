import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BudgetRangeSliderProps {
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  step?: number;
  onChange: (minValue: number, maxValue: number) => void;
  className?: string;
}

const BudgetRangeSlider: React.FC<BudgetRangeSliderProps> = ({
  minValue,
  maxValue,
  min,
  max,
  step = 1000,
  onChange,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const rect = (e.target as HTMLElement).closest('.slider-container')?.getBoundingClientRect();
    if (!rect) return;

    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const value = Math.round((percentage / 100) * (max - min) + min);
    const steppedValue = Math.round(value / step) * step;

    if (isDragging === 'min') {
      const newMinValue = Math.min(steppedValue, maxValue - step);
      if (newMinValue >= min && newMinValue <= max) {
        onChange(newMinValue, maxValue);
      }
    } else {
      const newMaxValue = Math.max(steppedValue, minValue + step);
      if (newMaxValue >= min && newMaxValue <= max) {
        onChange(minValue, newMaxValue);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, minValue, maxValue]);

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    if (isNaN(numericValue)) return;

    const steppedValue = Math.round(numericValue / step) * step;
    
    if (type === 'min') {
      const newMinValue = Math.min(Math.max(steppedValue, min), maxValue - step);
      onChange(newMinValue, maxValue);
    } else {
      const newMaxValue = Math.max(Math.min(steppedValue, max), minValue + step);
      onChange(minValue, newMaxValue);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Value Display */}
      <div className="flex justify-between items-center">
        <div className="text-center">
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Minimum Budget
          </label>
          <input
            type="text"
            value={formatCurrency(minValue)}
            onChange={(e) => handleInputChange('min', e.target.value)}
            className="w-32 px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)] text-center"
          />
        </div>
        <div className="text-center">
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Maximum Budget
          </label>
          <input
            type="text"
            value={formatCurrency(maxValue)}
            onChange={(e) => handleInputChange('max', e.target.value)}
            className="w-32 px-3 py-2 border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--card)] text-[var(--text)] text-center"
          />
        </div>
      </div>

      {/* Slider Container */}
      <div className="slider-container relative h-6">
        {/* Track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-[var(--border)] rounded-full transform -translate-y-1/2" />
        
        {/* Active Range */}
        <motion.div
          className="absolute top-1/2 h-2 bg-[var(--accent)] rounded-full transform -translate-y-1/2"
          style={{
            left: `${getPercentage(minValue)}%`,
            width: `${getPercentage(maxValue) - getPercentage(minValue)}%`,
          }}
          initial={false}
          animate={{
            left: `${getPercentage(minValue)}%`,
            width: `${getPercentage(maxValue) - getPercentage(minValue)}%`,
          }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Min Handle */}
        <motion.div
          className="absolute top-1/2 w-6 h-6 bg-[var(--accent)] rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2 hover:scale-110 transition-transform"
          style={{ left: `${getPercentage(minValue)}%` }}
          onMouseDown={handleMouseDown('min')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ left: `${getPercentage(minValue)}%` }}
          transition={{ duration: 0.1 }}
        />
        
        {/* Max Handle */}
        <motion.div
          className="absolute top-1/2 w-6 h-6 bg-[var(--accent)] rounded-full shadow-lg cursor-pointer transform -translate-y-1/2 -translate-x-1/2 hover:scale-110 transition-transform"
          style={{ left: `${getPercentage(maxValue)}%` }}
          onMouseDown={handleMouseDown('max')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ left: `${getPercentage(maxValue)}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Range Labels */}
      <div className="flex justify-between text-sm text-[var(--muted)]">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
    </div>
  );
};

export default BudgetRangeSlider;
