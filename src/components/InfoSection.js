import React from 'react';

const InfoSection = () => {
  return (
    <section className="py-20 bg-toyota-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-toyota-black mb-6">
            Find Your Perfect Toyota Lease & Financial Options
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get personalized financial guidance and discover the best Toyota lease deals tailored to your unique situation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Financial Analysis */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-toyota-red rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-toyota-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-toyota-black mb-4">
              Financial Analysis
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We'll analyze your financial situation to recommend the best Toyota lease options that fit your budget and lifestyle.
            </p>
          </div>

          {/* Personal Advice */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-toyota-red rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-toyota-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-toyota-black mb-4">
              Personal Guidance
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive personalized advice on vehicle selection, lease terms, and financial planning to make the best decision for your needs.
            </p>
          </div>

          {/* Lease Options */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-toyota-red rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-toyota-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-toyota-black mb-4">
              Best Lease Deals
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Access exclusive Toyota lease offers and compare different financing options to find the most competitive rates available.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-toyota-gray rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-toyota-black mb-4">
              Ready to Find Your Perfect Toyota?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let us help you navigate the leasing process with confidence. Get started by creating your account and sharing your financial information for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Get Started Today
              </button>
              <button className="btn-secondary text-toyota-black border-toyota-black hover:bg-toyota-black hover:text-toyota-white">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
