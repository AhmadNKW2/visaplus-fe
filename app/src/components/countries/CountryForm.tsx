/**
 * Country Form Component
 * Shared form component for creating and editing countries
 */

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Select, SelectOption } from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "../ui/table";
import { Card } from "../ui";
import { useValidation, ValidationRule } from "../../hooks/use-validation";

type AttributeRow = {
    attributeId: number;
    value_en: string;
    value_ar: string;
    isActive: boolean;
};

interface CountryFormProps {
    countriesWorld: any[];
    attributes: any[];
    initialCountryWorldId?: number;
    initialAttributes?: { attributeId: number; value_en: string; value_ar: string; isActive: boolean }[];
    onSubmit: (data: { countryWorldId: number; attributes: any[] }) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    submitButtonText: string;
}

export const CountryForm: React.FC<CountryFormProps> = ({
    countriesWorld,
    attributes,
    initialCountryWorldId,
    initialAttributes,
    onSubmit,
    onCancel,
    isSubmitting,
    submitButtonText,
}) => {
    const [selectedCountryWorldId, setSelectedCountryWorldId] = useState<string>(
        initialCountryWorldId?.toString() || ""
    );
    const [attributeRows, setAttributeRows] = useState<AttributeRow[]>([]);

    const { errors, validateField, validateForm } = useValidation();

    // Sort attributes by order
    const sortedAttributes = useMemo(() => {
        return [...attributes].sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [attributes]);

    // Initialize form with all attributes and sync when attributes change
    useEffect(() => {
        if (sortedAttributes.length > 0) {
            setAttributeRows((prevRows) => {
                // Create a map of existing rows for quick lookup
                const existingRowsMap = new Map(prevRows.map(row => [row.attributeId, row]));

                return sortedAttributes.map((attr) => {
                    // Check if we have an existing row state for this attribute
                    const existingRow = existingRowsMap.get(attr.id);

                    // Check if we have initial data for this attribute (from props)
                    const initialAttr = initialAttributes?.find(
                        (ia) => ia.attributeId === attr.id
                    );

                    // If we have an existing row state, preserve it (user might have edited it)
                    if (existingRow) {
                        return existingRow;
                    }

                    // Otherwise, initialize from props or default
                    return {
                        attributeId: attr.id,
                        value_en: initialAttr?.value_en || "",
                        value_ar: initialAttr?.value_ar || "",
                        // Active by default when creating new country, or use existing value when editing
                        isActive: initialAttr?.isActive ?? true,
                    };
                });
            });
        }
    }, [sortedAttributes, initialAttributes]);

    useEffect(() => {
        if (initialCountryWorldId) {
            setSelectedCountryWorldId(initialCountryWorldId.toString());
        }
    }, [initialCountryWorldId]);

    // Ensure countriesWorld is an array before using array methods
    const safeCountriesWorld = Array.isArray(countriesWorld) ? countriesWorld : [];

    // Memoize country options to prevent unnecessary re-renders
    const countryOptions: SelectOption[] = useMemo(() => safeCountriesWorld.map((country) => ({
        value: country.id.toString(),
        label: `${country.name_en} - ${country.name_ar}`,
    })), [safeCountriesWorld]);

    const selectedCountry = safeCountriesWorld.find(
        (c) => c.id.toString() === selectedCountryWorldId
    );

    const handleAttributeChange = (
        attributeId: number,
        field: keyof AttributeRow,
        value: string | boolean
    ) => {
        setAttributeRows((rows) =>
            rows.map((row) =>
                row.attributeId === attributeId ? { ...row, [field]: value } : row
            )
        );

        if (field === 'value_en') {
            validateField(`attribute_${attributeId}_en`, value, ['required', 'isEn']);
        } else if (field === 'value_ar') {
            validateField(`attribute_${attributeId}_ar`, value, ['required', 'isAr']);
        }
    };

    const handleSubmit = () => {
        const values: Record<string, any> = {
            countryWorldId: selectedCountryWorldId,
        };
        const config: Record<string, ValidationRule[]> = {
            countryWorldId: ['required'],
        };

        attributeRows.forEach(row => {
            if (row.isActive) {
                values[`attribute_${row.attributeId}_en`] = row.value_en;
                values[`attribute_${row.attributeId}_ar`] = row.value_ar;
                config[`attribute_${row.attributeId}_en`] = ['required', 'isEn'];
                config[`attribute_${row.attributeId}_ar`] = ['required', 'isAr'];
            }
        });

        if (!validateForm(values, config)) {
            return;
        }

        const countryData = {
            countryWorldId: parseInt(selectedCountryWorldId),
            attributes: attributeRows.map((row) => ({
                attributeId: row.attributeId,
                value_en: row.value_en,
                value_ar: row.value_ar,
                isActive: row.isActive,
            })),
        };

        onSubmit(countryData);
    };

    // Get attribute by ID
    const getAttributeById = (id: number) => {
        return sortedAttributes.find((attr) => attr.id === id);
    };

    return (
        <div className="p-8 flex flex-col gap-5">
            <div className="flex justify-between items-center">

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900">
                    {initialCountryWorldId ? "Edit Country" : "Create Country"}
                </h1>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <Button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {submitButtonText}
                    </Button>
                </div>

            </div>

            {/* Country Form */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900">
                    Country Information
                </h2>

                <div className="space-y-4">
                    {/* Country Select */}
                    <div>
                        <Select
                            label="Select Country"
                            value={selectedCountryWorldId}
                            onChange={(val) => {
                                setSelectedCountryWorldId(val as string);
                                validateField('countryWorldId', val, ['required']);
                            }}
                            options={countryOptions}
                            placeholder="Choose a country"
                            search
                            error={errors.countryWorldId}
                            name="countryWorldId"
                        />
                    </div>

                    {/* Country Preview */}
                    {selectedCountry && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            {selectedCountry.image_url && (
                                <div className="relative w-20 h-12">
                                    <Image
                                        src={selectedCountry.image_url}
                                        alt={selectedCountry.name_en}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-gray-900">
                                    {selectedCountry.name_en}
                                </p>
                                <p className="text-gray-600">{selectedCountry.name_ar}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Attributes Section */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900">Attributes</h2>

                {attributeRows.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead width="20%">Attribute</TableHead>
                                <TableHead width="35%">Value (EN)</TableHead>
                                <TableHead width="35%">Value (AR)</TableHead>
                                <TableHead width="10%" className="text-center!">Active</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attributeRows.map((row) => {
                                const attribute = getAttributeById(row.attributeId);
                                const isRowDisabled = !row.isActive;

                                return (
                                    <TableRow
                                        key={row.attributeId}
                                        className={isRowDisabled ? "opacity-50" : ""}
                                    >
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {attribute?.name_en}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {attribute?.name_ar}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                value={row.value_en}
                                                onChange={(e) =>
                                                    handleAttributeChange(
                                                        row.attributeId,
                                                        "value_en",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter English value"
                                                disabled={isRowDisabled}
                                                error={errors[`attribute_${row.attributeId}_en`]}
                                                name={`attribute_${row.attributeId}_en`}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                value={row.value_ar}
                                                onChange={(e) =>
                                                    handleAttributeChange(
                                                        row.attributeId,
                                                        "value_ar",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="أدخل القيمة بالعربية"
                                                isRtl
                                                disabled={isRowDisabled}
                                                error={errors[`attribute_${row.attributeId}_ar`]}
                                                name={`attribute_${row.attributeId}_ar`}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center!">
                                            <Checkbox
                                                checked={row.isActive}
                                                onChange={(checked) =>
                                                    handleAttributeChange(
                                                        row.attributeId,
                                                        "isActive",
                                                        checked
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No attributes available. Please create attributes first.
                    </div>
                )}
            </Card>
        </div>
    );
};
