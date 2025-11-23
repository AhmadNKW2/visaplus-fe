/**
 * Custom Checkbox Component
 */

"use client";

import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}) => {
  const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // If no label, just render the input directly
  if (!label) {
    return (
      <div className={`checkbox-wrapper-13 ${className}`}>
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
        />
      </div>
    );
  }

  // If label exists, render with label wrapper
  return (
    <div className={`checkbox-wrapper-13 ${className}`}>
      <input
        id={checkboxId}
        type="checkbox"
        checked={checked}
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
      />
      <label htmlFor={checkboxId}>{label}</label>
    </div>
  );
};
