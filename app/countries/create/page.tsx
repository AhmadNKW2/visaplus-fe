/**
 * Create Country Page
 * Page for creating a new country with attributes
 */

"use client";

import { useRouter } from "next/navigation";
import { CountryForm } from "../../src/components/countries/CountryForm";
import {
    useCreateCountry,
    useCountriesWorld,
} from "../../src/services/countries/hooks/use-countries";
import { useAttributes } from "../../src/services/attributes/hooks/use-attributes";

export default function CreateCountryPage() {
    const router = useRouter();
    const { data: countriesWorld, isLoading: isLoadingCountries } = useCountriesWorld();
    const { data: attributesData, isLoading: isLoadingAttributes } = useAttributes();
    const createMutation = useCreateCountry();

    const attributes = attributesData?.items || [];

    const handleSubmit = async (data: any) => {
        if (!data.countryWorldId) {
            return;
        }

        try {
            await createMutation.mutateAsync(data);
            router.push("/countries");
        } catch (error: any) {
            console.error("Failed to create country:", error);
        }
    };

    const handleCancel = () => {
        router.push("/countries");
    };

    if (isLoadingCountries || isLoadingAttributes) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <CountryForm
            countriesWorld={countriesWorld || []}
            attributes={attributes}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createMutation.isPending}
            submitButtonText="Create Country"
        />
    );
}
