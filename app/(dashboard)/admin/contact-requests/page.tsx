/**
 * Contact Requests Page
 * Main page for viewing contact requests with table view
 * Updated imports for new structure
 */

"use client";

import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "../../../src/components/ui/table";
import { Pagination } from "../../../src/components/ui/pagination";
import { Filter, FilterRow, FilterValues } from "../../../src/components/common/Filter";
import { useContactRequests, useDeleteContactRequest } from "../../../src/services/contact-requests/hooks/use-contact-requests";
import { ContactRequest } from "../../../src/services/contact-requests/types/contact-request.types";
import { IconButton } from "../../../src/components/ui/icon-button";
import { DeleteConfirmationModal } from "../../../src/components/common/DeleteConfirmationModal";

export default function ContactRequestsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState<{ key: string; order: 'asc' | 'desc' } | null>({
        key: 'createdAt',
        order: 'desc'
    });
    const [filterValues, setFilterValues] = useState<FilterValues>({
        search: "",
        dateStart: "",
        dateEnd: "",
    });

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const deleteMutation = useDeleteContactRequest();

    // Define filter rows for contact requests
    const filterRows: FilterRow[] = [
        {
            cols: 4, // Total columns in the row
            fields: [
                {
                    name: "search",
                    label: "Search",
                    type: "search",
                    placeholder: "Search contact requests...",
                    colSpan: 2, // Search takes 2 columns
                },
                {
                    name: "dateStart",
                    label: "Start Date",
                    type: "date",
                    placeholder: "Start Date",
                    colSpan: 1, // Start date takes 1 column
                },
                {
                    name: "dateEnd",
                    label: "End Date",
                    type: "date",
                    placeholder: "End Date",
                    colSpan: 1, // End date takes 1 column
                },
            ],
        },
    ];

    const { data, isLoading, error } = useContactRequests({
        page: currentPage,
        limit: pageSize,
        sort: sortConfig ? `${sortConfig.key}:${sortConfig.order}` : undefined,
        search: filterValues.search,
        startDate: filterValues.dateStart,
        endDate: filterValues.dateEnd,
    });

    const contactRequests = data?.items || [];
    // Ensure meta has default values if missing
    const meta = {
        total: data?.meta?.total || 0,
        page: data?.meta?.page || 1,
        limit: data?.meta?.limit || 10,
        totalPages: data?.meta?.totalPages || Math.ceil((data?.meta?.total || 0) / (data?.meta?.limit || 10)),
        hasNextPage: data?.meta?.hasNextPage ?? false,
        hasPreviousPage: data?.meta?.hasPreviousPage ?? false
    };

    const handleSort = (key: string) => {
        setSortConfig((current) => {
            if (current?.key === key) {
                return { key, order: current.order === 'asc' ? 'desc' : 'asc' };
            }
            return { key, order: 'asc' };
        });
    };

    const handleFilterChange = (values: FilterValues) => {
        setFilterValues(values);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId) {
            await deleteMutation.mutateAsync(selectedId);
            setDeleteModalOpen(false);
            setSelectedId(null);
        }
    };

    if (error) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-600">
                        Error loading contact requests. Please try again.
                    </div>
                </div>
            </div>
        );
    }

    else {

        return (
            <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Contact Requests</h1>
                    </div>
                </div>

                {/* Filter */}
                <Filter
                    rows={filterRows}
                    values={filterValues}
                    onFilterChange={handleFilterChange}
                />

                {/* Table */}
                {contactRequests && contactRequests.length > 0 ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        width="10%"
                                        sortable
                                        sortKey="id"
                                        currentSort={sortConfig}
                                        onSort={handleSort}
                                    >
                                        ID
                                    </TableHead>
                                    <TableHead
                                        width="20%"
                                        sortable
                                        sortKey="name"
                                        currentSort={sortConfig}
                                        onSort={handleSort}
                                    >
                                        Name
                                    </TableHead>
                                    <TableHead
                                        width="20%"
                                        sortable
                                        sortKey="nationality"
                                        currentSort={sortConfig}
                                        onSort={handleSort}
                                    >
                                        Nationality
                                    </TableHead>
                                    <TableHead width="15%">Phone Number</TableHead>
                                    <TableHead
                                        width="20%"
                                        sortable
                                        sortKey="destinationCountry"
                                        currentSort={sortConfig}
                                        onSort={handleSort}
                                    >
                                        Destination Country
                                    </TableHead>
                                    <TableHead
                                        width="15%"
                                        sortable
                                        sortKey="createdAt"
                                        currentSort={sortConfig}
                                        onSort={handleSort}
                                    >
                                        Date
                                    </TableHead>
                                    <TableHead width="10%">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contactRequests.map((request: ContactRequest) => (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.id}</TableCell>
                                        <TableCell>{request.name}</TableCell>
                                        <TableCell>{request.nationality}</TableCell>
                                        <TableCell>{request.phoneNumber}</TableCell>
                                        <TableCell>{request.destinationCountry}</TableCell>
                                        <TableCell>
                                            {request.createdAt ? (() => {
                                                const date = new Date(request.createdAt);
                                                const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                                                const dateStr = date.toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit', year: 'numeric' });
                                                return `${time}, ${dateStr}`;
                                            })() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <IconButton
                                                    variant="delete"
                                                    onClick={() => handleDeleteClick(request.id)}
                                                    title="Delete Request"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

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
                        <p className="text-gray-500 text-lg mb-4">No contact requests found</p>
                    </div>
                )}

                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Contact Request"
                    message="Are you sure you want to delete this contact request? This action cannot be undone."
                    isDeleting={deleteMutation.isPending}
                />
            </div>
        );
    }
}