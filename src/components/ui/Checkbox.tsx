import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export default function Checkbox({
  label,
  description,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer ${className}`}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-gray-700 cursor-pointer">
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
