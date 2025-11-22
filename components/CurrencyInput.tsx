import React from 'react';
import { Currency } from '../types';

interface CurrencyInputProps {
  currency: Currency;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  currency, 
  value, 
  onChange, 
  label 
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*[.,]?\d*$/.test(val)) {
      onChange(val);
    }
  };

  // Material Design "Outlined" Text Field look
  return (
    <div className="relative mt-2">
      <input
        type="text" 
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        id={`input-${currency}`}
        placeholder=" "
        className="peer block w-full rounded border border-gray-400 bg-transparent px-3 pt-4 pb-2 text-xl font-normal text-gray-900 focus:border-2 focus:border-primary-500 focus:outline-none"
      />
      <label
        htmlFor={`input-${currency}`}
        className="absolute left-3 top-3 origin-[0] -translate-y-5 scale-75 transform bg-[#fafafa] px-1 text-sm text-gray-500 duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-3 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-primary-500"
      >
        {label} ({currency})
      </label>
      <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
        {currency}
      </div>
    </div>
  );
};