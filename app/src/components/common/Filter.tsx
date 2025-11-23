/**
 * Filter Component
 * Dynamic and reusable filter component with search and custom filter fields
 */

"use client";

import React from "react";
import { Input } from "../ui/input";
import { Select, SelectOption } from "../ui/select";
import { DatePicker } from "../ui/date-picker";
import { Button } from "../ui/button";
import { Search, X } from "lucide-react";

export type FilterFieldType = "text" | "select" | "date" | "dateRange" | "search";

export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  options?: SelectOption[]; // For select type
  colSpan?: number; // How many columns this field should span (default: 1)
}

export interface FilterRow {
  cols: number; // Total number of columns in this row
  fields: FilterField[];
}

export interface FilterValues {
  search?: string;
  [key: string]: any;
}

interface FilterProps {
  rows: FilterRow[];
  values: FilterValues;
  onFilterChange: (values: FilterValues) => void;
  onReset?: () => void;
}

export const Filter: React.FC<FilterProps> = ({
  rows,
  values,
  onFilterChange,
  onReset,
}) => {
  const handleFieldChange = (name: string, value: any) => {
    onFilterChange({ ...values, [name]: value });
  };

  const renderField = (filter: FilterField) => {
    if (filter.type === "search") {
      return (
        <Input
          key={filter.name}
          type="text"
          value={values[filter.name] || ""}
          onChange={(e) => handleFieldChange(filter.name, e.target.value)}
          placeholder={filter.placeholder || "Search..."}
          isSearch
        />
      );
    }

    if (filter.type === "text") {
      return (
        <Input
          key={filter.name}
          type="text"
          value={values[filter.name] || ""}
          onChange={(e) => handleFieldChange(filter.name, e.target.value)}
          placeholder={filter.placeholder || filter.label}
        />
      );
    }

    if (filter.type === "select") {
      return (
        <Select
          key={filter.name}
          value={values[filter.name] || ""}
          onChange={(value) => handleFieldChange(filter.name, value)}
          options={filter.options || []}
          placeholder={filter.placeholder || `Select ${filter.label}`}
        />
      );
    }

    if (filter.type === "date") {
      return (
        <DatePicker
          key={filter.name}
          value={values[filter.name] || ""}
          onChange={(value) => handleFieldChange(filter.name, value)}
          placeholder={filter.placeholder || filter.label}
        />
      );
    }

    if (filter.type === "dateRange") {
      // Date range uses two separate date pickers
      const startName = `${filter.name}Start`;
      const endName = `${filter.name}End`;
      return (
        <React.Fragment key={filter.name}>
          <DatePicker
            value={values[startName] || ""}
            onChange={(value) => handleFieldChange(startName, value)}
            placeholder={`${filter.label} (From)`}
          />
          <DatePicker
            value={values[endName] || ""}
            onChange={(value) => handleFieldChange(endName, value)}
            placeholder={`${filter.label} (To)`}
          />
        </React.Fragment>
      );
    }

    return null;
  };

  const getGridColsClass = (cols: number) => {
    const colsMap: { [key: number]: string } = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    return colsMap[cols] || "grid-cols-1";
  };

  const getColSpanClass = (colSpan: number) => {
    const colSpanMap: { [key: number]: string } = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
    };
    return colSpanMap[colSpan] || "col-span-1";
  };

  return (
    <div className="bg-white rounded-rounded1 border border-primary shadow-shadow1 p-5 mb-6">
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`grid ${getGridColsClass(row.cols)} gap-4`}
          >
            {row.fields.map((field) => (
              <div key={field.name} className={getColSpanClass(field.colSpan || 1)}>
                {renderField(field)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
