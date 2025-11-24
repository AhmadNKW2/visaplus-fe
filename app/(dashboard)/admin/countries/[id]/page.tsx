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

        try {
            await updateMutation.mutateAsync({
                id: countryId,
                data,
            });
            router.push("/admin/countries");
        } catch (error: any) {
            console.error("Failed to update country:", error);
        }
    };

    const handleCancel = () => {
        router.push("/admin/countries");
    };

    if (isLoadingCountry || isLoadingCountries || isLoadingAttributes) {
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
