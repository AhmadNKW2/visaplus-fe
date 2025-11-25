/**
 * Edit Country Page
 * Page for editing an existing country with attributes
 */

"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { CountryForm } from "../../../../src/components/countries/CountryForm";
import {
    useCountry,
    useUpdateCountry,
    useCountriesWorld,
} from "../../../../src/services/countries/hooks/use-countries";
import { useAttributes } from "../../../../src/services/attributes/hooks/use-attributes";

export default function EditCountryPage() {
    const router = useRouter();
    const params = useParams();
    const countryId = parseInt(params.id as string);

    const { data: country, isLoading: isLoadingCountry } = useCountry(countryId);
    const { data: countriesWorld, isLoading: isLoadingCountries } = useCountriesWorld();
    const { data: attributesData, isLoading: isLoadingAttributes } = useAttributes({ limit: 1000 });
    const updateMutation = useUpdateCountry();

    const attributes = attributesData?.items || [];

    const handleSubmit = async (data: any) => {
        if (!data.countryWorldId) {
            return;
        }

        // Calculate only changed values
        const changedData: any = {};
        
        // Check if countryWorldId changed
        if (country.countryWorldId !== data.countryWorldId) {
            changedData.countryWorldId = data.countryWorldId;
        }

        // Check if attributes changed
        const changedAttributes = data.attributes.filter((newAttr: any) => {
            const oldAttr = country.attributes?.find(
                (attr: any) => attr.attributeId === newAttr.attributeId
            );
            
            if (!oldAttr) return true; // New attribute
            
            // Check if any field changed
            return (
                oldAttr.value_en !== newAttr.value_en ||
                oldAttr.value_ar !== newAttr.value_ar ||
                oldAttr.isActive !== newAttr.isActive
            );
        });

        if (changedAttributes.length > 0) {
            changedData.attributes = changedAttributes;
        }

        // Only send PATCH if there are actual changes
        if (Object.keys(changedData).length === 0) {
            router.push("/admin/countries");
            return;
        }

        try {
            await updateMutation.mutateAsync({
                id: countryId,
                data: changedData,
            });
            router.push("/admin/countries");
        } catch (error: any) {
            console.error("Failed to update country:", error);
        }
    };

    const handleCancel = () => {
        router.push("/admin/countries");
    };

    if (isLoadingCountry || isLoadingAttributes) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    if (!country) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">Country not found</div>
                </div>
            </div>
        );
    }

    // Transform attributes to match the expected format
    const transformedAttributes = country.attributes?.map((attr: any) => ({
        attributeId: attr.attributeId,
        value_en: attr.value_en,
        value_ar: attr.value_ar,
        isActive: attr.isActive,
    })) || [];

    return (
        <CountryForm
            countriesWorld={countriesWorld || []}
            attributes={attributes}
            initialCountryWorldId={country.countryWorldId}
            initialAttributes={transformedAttributes}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={updateMutation.isPending}
            submitButtonText="Update Country"
        />
    );
}
