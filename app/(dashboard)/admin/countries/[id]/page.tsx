/**
 * Edit Country Page
 * Page for editing an existing country with attributes
 */

"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CountryForm } from "../../../../src/components/countries/CountryForm";
import {
    useCountry,
    useUpdateCountry,
    useCountriesWorld,
} from "../../../../src/services/countries/hooks/use-countries";
import { useAttributes } from "../../../../src/services/attributes/hooks/use-attributes";
import { queryKeys } from "../../../../src/lib/query-keys";

export default function EditCountryPage() {
    const router = useRouter();
    const params = useParams();
    const countryId = parseInt(params.id as string);
    const queryClient = useQueryClient();

    const { data: country, isLoading: isLoadingCountry } = useCountry(countryId);
    const { data: countriesWorld, isLoading: isLoadingCountries } = useCountriesWorld();
    const { data: attributesData, isLoading: isLoadingAttributes } = useAttributes({ limit: 1000 });
    const updateMutation = useUpdateCountry();

    const attributes = attributesData?.items || [];

    const handleSubmit = async (data: any) => {
        if (!data.countryWorldId) {
            return;
        }

        // Send full country data with PUT request
        const fullCountryData = {
            countryWorldId: data.countryWorldId,
            attributes: data.attributes.map((attr: any) => ({
                attributeId: attr.attributeId,
                value_en: attr.value_en,
                value_ar: attr.value_ar,
                isActive: attr.isActive,
            })),
        };

        try {
            const response = await updateMutation.mutateAsync({
                id: countryId,
                data: fullCountryData,
            });
            // Update the query cache with the updated country data
            queryClient.setQueryData(queryKeys.countries.detail(countryId), {
                data: response.data,
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
