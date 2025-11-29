/**
 * Attributes Page
 * Main page for managing attributes with inline create and edit functionality
 * Supports drag-and-drop reordering
 */

"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "../../../src/components/ui/input";
import { IconButton } from "../../../src/components/ui/icon-button";
import { Pagination } from "../../../src/components/ui/pagination";
import { Filter, FilterRow, FilterValues } from "../../../src/components/common/Filter";
import { DeleteConfirmationModal } from "../../../src/components/common/DeleteConfirmationModal";
import {
    useAttributes,
    useCreateAttribute,
    useUpdateAttribute,
    useDeleteAttribute,
    useReorderAttributes,
} from "../../../src/services/attributes/hooks/use-attributes";
import { Attribute } from "../../../src/services/attributes/types/attribute.types";
import { useValidation, ValidationRule } from "../../../src/hooks/use-validation";

type EditMode = {
    id: number | "new";
    nameEn: string;
    nameAr: string;
};

// Sortable row component
function SortableRow({
    attribute,
    isEditing,
    editMode,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onEditModeChange,
    onKeyDown,
    isSaving,
    errors,
    validateField,
}: {
    attribute: Attribute;
    isEditing: boolean;
    editMode: EditMode | null;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
    onEditModeChange: (mode: EditMode) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    isSaving: boolean;
    errors: Record<string, string>;
    validateField: (name: string, value: any, rules: ValidationRule[]) => boolean;
}) {
    const {
        attributes: sortableAttributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: attribute.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={isEditing ? "bg-primary/50" : ""}
        >
            <TableCell>
                <div
                    {...listeners}
                    {...sortableAttributes}
                    className="cursor-grab active:cursor-grabbing inline-flex items-center justify-center"
                >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                </div>
            </TableCell>
            <TableCell>{attribute.id}</TableCell>
            <TableCell>
                {isEditing && editMode ? (
                    <Input
                        type="text"
                        value={editMode.nameEn}
                        onChange={(e) => {
                            onEditModeChange({ ...editMode, nameEn: e.target.value });
                            validateField('nameEn', e.target.value, ['required', 'isEn']);
                        }}
                        onKeyDown={onKeyDown}
                        placeholder="Enter English name"
                        className="w-full"
                        autoFocus
                        error={errors.nameEn}
                        name="nameEn"
                    />
                ) : (
                    attribute.name_en
                )}
            </TableCell>
            <TableCell>
                {isEditing && editMode ? (
                    <Input
                        type="text"
                        value={editMode.nameAr}
                        onChange={(e) => {
                            onEditModeChange({ ...editMode, nameAr: e.target.value });
                            validateField('nameAr', e.target.value, ['required', 'isAr']);
                        }}
                        onKeyDown={onKeyDown}
                        placeholder="أدخل الاسم بالعربية"
                        className="w-full"
                        isRtl
                        error={errors.nameAr}
                        name="nameAr"
                    />
                ) : (
                    <div>{attribute.name_ar}</div>
                )}
            </TableCell>
            <TableCell>
                <div className="flex items-center justify-start gap-2">
                    {isEditing ? (
                        <>
                            <IconButton
                                onClick={onSave}
                                disabled={isSaving}
                                variant="check"
                                title="Save"
                            />
                            <IconButton
                                onClick={onCancel}
                                disabled={isSaving}
                                variant="cancel"
                                title="Cancel"
                            />
                        </>
                    ) : (
                        <>
                            <IconButton
                                onClick={onEdit}
                                variant="edit"
                                title="Edit attribute"
                            />
                            <IconButton
                                onClick={onDelete}
                                variant="delete"
                                title="Delete attribute"
                            />
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    );
}

export default function AttributesPage() {
    const [editMode, setEditMode] = useState<EditMode | null>(null);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        attribute: Attribute | null;
    }>({
        isOpen: false,
        attribute: null,
    });
    const [localAttributes, setLocalAttributes] = useState<Attribute[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [filterValues, setFilterValues] = useState<FilterValues>({ search: "" });

    const { errors, validateField, validateForm, clearError } = useValidation();

    const { data, isLoading, error } = useAttributes({
        page: currentPage,
        limit: pageSize,
        search: filterValues.search,
    });

    const meta = data?.meta || {};
    const createMutation = useCreateAttribute();
    const updateMutation = useUpdateAttribute();
    const deleteMutation = useDeleteAttribute();
    const reorderMutation = useReorderAttributes();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Update local state when attributes change
    useEffect(() => {
        const attributesData = data?.items;
        if (attributesData && Array.isArray(attributesData)) {
            setLocalAttributes([...attributesData].sort((a, b) => a.order - b.order));
        }
    }, [data?.items]);

    const handleCreate = () => {
        setEditMode({
            id: "new",
            nameEn: "",
            nameAr: "",
        });
        clearError('nameEn');
        clearError('nameAr');
    };

    const handleEdit = (attribute: Attribute) => {
        setEditMode({
            id: attribute.id,
            nameEn: attribute.name_en,
            nameAr: attribute.name_ar,
        });
        clearError('nameEn');
        clearError('nameAr');
    };

    const handleCancel = () => {
        setEditMode(null);
        clearError('nameEn');
        clearError('nameAr');
    };

    const handleSave = async () => {
        if (!editMode) return;

        if (!validateForm({
            nameEn: editMode.nameEn,
            nameAr: editMode.nameAr
        }, {
            nameEn: ['required', 'isEn'],
            nameAr: ['required', 'isAr']
        })) {
            return;
        }

        try {
            if (editMode.id === "new") {
                const response = await createMutation.mutateAsync({
                    name_en: editMode.nameEn,
                    name_ar: editMode.nameAr,
                });
                // Update local state with response data
                const createdAttribute = response.data;
                setLocalAttributes([...localAttributes, createdAttribute]);
            } else {
                const response = await updateMutation.mutateAsync({
                    id: editMode.id,
                    data: {
                        name_en: editMode.nameEn,
                        name_ar: editMode.nameAr,
                    },
                });
                // Update local state with response data
                const updatedAttribute = response.data;
                setLocalAttributes(
                    localAttributes.map(attr => 
                        attr.id === editMode.id ? updatedAttribute : attr
                    )
                );
            }
            setEditMode(null);
        } catch (error) {
            console.error("Failed to save attribute:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
    };

    const handleDeleteClick = (attribute: Attribute) => {
        setDeleteModal({
            isOpen: true,
            attribute,
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.attribute) return;

        try {
            await deleteMutation.mutateAsync(deleteModal.attribute.id);
            setDeleteModal({ isOpen: false, attribute: null });
        } catch (error) {
            console.error("Failed to delete attribute:", error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, attribute: null });
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
            const oldIndex = localAttributes.findIndex((item) => item.id === active.id);
            const newIndex = localAttributes.findIndex((item) => item.id === over.id);

            const newOrder = arrayMove(localAttributes, oldIndex, newIndex);
            setLocalAttributes(newOrder);

            // Send reorder request to API
            try {
                await reorderMutation.mutateAsync({
                    attributes: newOrder.map((attr, index) => ({
                        id: attr.id,
                        order: index + 1,
                    })),
                });
            } catch (error) {
                console.error("Failed to reorder attributes:", error);
                // Revert on error
                const attributesData = data?.items;
                if (attributesData && Array.isArray(attributesData)) {
                    setLocalAttributes([...attributesData].sort((a, b) => a.order - b.order));
                }
            }
        }
    };

    if (error) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">
                        Error loading attributes. Please try again.
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
                    <h1 className="text-3xl font-bold text-gray-900">Attributes</h1>
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
                                placeholder: "Search attributes...",
                            },
                        ],
                    },
                ]}
                values={filterValues}
                onFilterChange={handleFilterChange}
            />

            {/* Table */}
            {localAttributes.length > 0 || editMode ? (
                <>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead width="8%">Drag</TableHead>
                                    <TableHead width="10%">ID</TableHead>
                                    <TableHead width="33%">Name (English)</TableHead>
                                    <TableHead width="33%">Name (Arabic)</TableHead>
                                    <TableHead width="16%">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Sortable Attributes */}
                                <SortableContext
                                    items={localAttributes.map((attr) => attr.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {localAttributes.map((attribute) => {
                                        const isEditing = editMode?.id === attribute.id;

                                        return (
                                            <SortableRow
                                                key={attribute.id}
                                                attribute={attribute}
                                                isEditing={isEditing}
                                                editMode={editMode}
                                                onEdit={() => handleEdit(attribute)}
                                                onSave={handleSave}
                                                onCancel={handleCancel}
                                                onDelete={() => handleDeleteClick(attribute)}
                                                onEditModeChange={setEditMode}
                                                onKeyDown={handleKeyDown}
                                                isSaving={updateMutation.isPending}
                                                errors={errors}
                                                validateField={validateField}
                                            />
                                        );
                                    })}
                                </SortableContext>

                                {/* New Row for Creating - Moved to bottom */}
                                {editMode?.id === "new" && (
                                    <TableRow className="bg-primary/50">
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                value={editMode.nameEn}
                                                onChange={(e) => {
                                                    setEditMode({ ...editMode, nameEn: e.target.value });
                                                    validateField('nameEn', e.target.value, ['required', 'isEn']);
                                                }}
                                                onKeyDown={handleKeyDown}
                                                placeholder="Enter English name"
                                                className="w-full"
                                                autoFocus
                                                error={errors.nameEn}
                                                name="nameEn"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="text"
                                                value={editMode.nameAr}
                                                onChange={(e) => {
                                                    setEditMode({ ...editMode, nameAr: e.target.value });
                                                    validateField('nameAr', e.target.value, ['required', 'isAr']);
                                                }}
                                                isRtl
                                                onKeyDown={handleKeyDown}
                                                placeholder="أدخل الاسم بالعربية"
                                                className="w-full"
                                                error={errors.nameAr}
                                                name="nameAr"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-start gap-2">
                                                <IconButton
                                                    onClick={handleSave}
                                                    disabled={createMutation.isPending}
                                                    variant="check"
                                                    title="Save"
                                                />
                                                <IconButton
                                                    onClick={handleCancel}
                                                    disabled={createMutation.isPending}
                                                    variant="cancel"
                                                    title="Cancel"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
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
                    <p className="text-gray-500 text-lg mb-4">No attributes found</p>
                    <Button onClick={handleCreate}>
                        Create Your First Attribute
                    </Button>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Attribute"
                message="Are you sure you want to delete this attribute?"
                itemName={deleteModal.attribute?.name_en}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
