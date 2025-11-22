import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-base font-medium text-gray-800">{label}</span>
      
      <div 
        className="relative inline-flex cursor-pointer items-center"
        onClick={() => onChange(!checked)}
      >
        {/* Track */}
        <div className={`h-4 w-10 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-primary-500/50' : 'bg-gray-400'}`}></div>
        
        {/* Thumb */}
        <div className={`absolute left-0 h-6 w-6 transform rounded-full shadow-material-1 ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4 bg-primary-600' : '-translate-x-1 bg-white'}`}></div>
      </div>
    </div>
  );
};