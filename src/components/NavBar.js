import React from 'react';

const NavBar = () => {
  return (
    <nav className="bg-toyota-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Toyota Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-toyota-red rounded-full flex items-center justify-center">
                <span className="text-toyota-white font-bold text-xl">T</span>
              </div>
              <span className="ml-3 text-toyota-black font-bold text-xl">TOYOTA</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#vehicles"
                className="text-toyota-black hover:text-toyota-red px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Vehicles
              </a>
              <a
                href="#shop"
                className="text-toyota-black hover:text-toyota-red px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Shop
              </a>
              <a
                href="#support"
                className="text-toyota-black hover:text-toyota-red px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Support
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-toyota-black hover:text-toyota-red focus:outline-none focus:text-toyota-red"
              aria-label="Open main menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-toyota-gray">
          <a
            href="#vehicles"
            className="text-toyota-black hover:text-toyota-red block px-3 py-2 text-base font-medium"
          >
            Vehicles
          </a>
          <a
            href="#shop"
            className="text-toyota-black hover:text-toyota-red block px-3 py-2 text-base font-medium"
          >
            Shop
          </a>
          <a
            href="#support"
            className="text-toyota-black hover:text-toyota-red block px-3 py-2 text-base font-medium"
          >
            Support
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
