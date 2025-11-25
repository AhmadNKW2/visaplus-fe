/**
 * Countries Page
 * Main page for managing countries with table view
 * Supports drag-and-drop reordering
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "../../../src/components/ui/table";
import { Button } from "../../../src/components/ui/button";
import { IconButton } from "../../../src/components/ui/icon-button";
import { Pagination } from "../../../src/components/ui/pagination";
import { Filter, FilterRow, FilterValues } from "../../../src/components/common/Filter";
import { DeleteConfirmationModal } from "../../../src/components/common/DeleteConfirmationModal";
import {
    useCountries,
    useDeleteCountry,
    useReorderCountries,
} from "../../../src/services/countries/hooks/use-countries";
import { Country } from "../../../src/services/countries/types/country.types";
import Image from "next/image";

// Sortable row component
function SortableRow({
    country,
    onEdit,
    onDelete,
    isDeleting,
}: {
    country: Country;
    onEdit: () => void;
    onDelete: () => void;
    isDeleting: boolean;
}) {
    const {
        attributes: sortableAttributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: country.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell>
                <div
                    {...listeners}
                    {...sortableAttributes}
                    className="cursor-grab active:cursor-grabbing inline-flex items-center justify-center"
                >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                </div>
            </TableCell>
            <TableCell>{country.id}</TableCell>
            <TableCell>
                {country.countryWorld?.image_url && (
                    <div className="relative h-12 w-20">
                        <Image
                            src={country.countryWorld.image_url}
                            alt={country.countryWorld.name_en}
                            fill
                            className="rounded object-cover"
                        />
                    </div>
                )}
            </TableCell>
            <TableCell>{country.countryWorld?.name_en || "-"}</TableCell>
            <TableCell>{country.countryWorld?.name_ar || "-"}</TableCell>
            <TableCell>
                <div className="flex items-center justify-start gap-2">
                    {/* Edit Button */}
                    <IconButton
                        onClick={onEdit}
                        variant="edit"
                        title="Edit country"
                    />

                    {/* Delete Button */}
                    <IconButton
                        onClick={onDelete}
                        disabled={isDeleting}
                        variant="delete"
                        title="Delete country"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function CountriesPage() {
    const router = useRouter();
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        country: Country | null;
    }>({
        isOpen: false,
        country: null,
    });
    const [localCountries, setLocalCountries] = useState<Country[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [filterValues, setFilterValues] = useState<FilterValues>({ search: "" });

    const { data, isLoading, error } = useCountries({
        page: currentPage,
        limit: pageSize,
        search: filterValues.search,
    });

    const meta = data?.meta || {};
    const deleteMutation = useDeleteCountry();
    const reorderMutation = useReorderCountries();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Update local state when countries change
    useEffect(() => {
        const countriesData = data?.items;
        if (countriesData && Array.isArray(countriesData)) {
            setLocalCountries([...countriesData].sort((a, b) => a.order - b.order));
        }
    }, [data?.items]);

    const handleCreate = () => {
        router.push("/admin/countries/create");
    };

    const handleEdit = (countryId: number) => {
        router.push(`/admin/countries/${countryId}`);
    };

    const handleDeleteClick = (country: Country) => {
        setDeleteModal({
            isOpen: true,
            country,
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.country) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.country.id);
            setDeleteModal({ isOpen: false, country: null });
        } catch (error) {
            console.error("Failed to delete country:", error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, country: null });
    };

    const handleFilterChange = (values: FilterValues) => {
        setFilterValues(values);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setCurrentPage(1);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localCountries.findIndex((item) => item.id === active.id);
            const newIndex = localCountries.findIndex((item) => item.id === over.id);

            const newOrder = arrayMove(localCountries, oldIndex, newIndex);
            setLocalCountries(newOrder);

            // Send reorder request to API
            try {
                await reorderMutation.mutateAsync({
                    countries: newOrder.map((country, index) => ({
                        id: country.id,
                        order: index + 1,
                    })),
                });
            } catch (error) {
                console.error("Failed to reorder countries:", error);
                // Revert on error
                const countriesData = data?.items;
                if (countriesData && Array.isArray(countriesData)) {
                    setLocalCountries([...countriesData].sort((a, b) => a.order - b.order));
                }
            }
        }
    };

    if (error) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">
                        Error loading countries. Please try again.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Countries</h1>
                </div>
                <Button onClick={handleCreate}>
                    Create
                </Button>
            </div>

            {/* Filter */}
            <Filter
                rows={[
                    {
                        cols: 1,
                        fields: [
                            {
                                name: "search",
                                label: "Search",
                                type: "search",
                                placeholder: "Search countries...",
                            },
                        ],
                    },
                ]}
                values={filterValues}
                onFilterChange={handleFilterChange}
            />

            {/* Table */}
            {localCountries && localCountries.length > 0 ? (
                <>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localCountries.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead width="5%">Order</TableHead>
                                        <TableHead width="10%">ID</TableHead>
                                        <TableHead width="20%">Flag</TableHead>
                                        <TableHead width="25%">Name (English)</TableHead>
                                        <TableHead width="20%">Name (Arabic)</TableHead>
                                        <TableHead width="20%">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {localCountries.map((country: Country) => (
                                        <SortableRow
                                            key={country.id}
                                            country={country}
                                            onEdit={() => handleEdit(country.id)}
                                            onDelete={() => handleDeleteClick(country)}
                                            isDeleting={deleteMutation.isPending}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </SortableContext>
                    </DndContext>

                    {/* Pagination */}
                    <div className="mt-6">
                        <Pagination
                            pagination={{
                                currentPage: meta.page || currentPage,
                                pageSize: meta.limit || pageSize,
                                totalItems: meta.total || 0,
                                totalPages: meta.totalPages || 1,
                                hasNextPage: meta.hasNextPage || false,
                                hasPreviousPage: meta.hasPreviousPage || false,
                            }}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            showPageSize={true}
                        />
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-gray-500 text-lg mb-4">No countries found</p>
                    <Button onClick={handleCreate}>
                        Create Your First Country
                    </Button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Country"
                message="Are you sure you want to delete this country?"
                itemName={deleteModal.country?.countryWorld?.name_en}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
