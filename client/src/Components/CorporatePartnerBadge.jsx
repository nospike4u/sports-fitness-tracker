import React from 'react';

const CorporatePartnerBadge = ({ companyName, companyLogo }) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2">
        <svg 
          className="w-5 h-5 text-blue-600 dark:text-blue-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Your wellness program is powered by
        </span>
        {companyLogo ? (
          <img src={companyLogo} alt={companyName} className="h-6 object-contain" />
        ) : (
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            {companyName}
          </span>
        )}
      </div>
    </div>
  );
};

export default CorporatePartnerBadge;
