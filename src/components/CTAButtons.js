import React from 'react';

const CTAButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
      <button className="btn-primary w-full sm:w-auto">
        Login
      </button>
      <button className="btn-secondary w-full sm:w-auto">
        Create Account
      </button>
    </div>
  );
};

export default CTAButtons;
