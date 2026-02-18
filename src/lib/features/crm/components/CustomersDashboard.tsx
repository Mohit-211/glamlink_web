'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Customer } from '../types/customer';
import { CustomersTable } from './CustomersTable';
import { CustomerSearchBar } from './CustomerSearchBar';
import { AddCustomerModal } from './AddCustomerModal';
import { ExportCustomersButton } from './ExportCustomersButton';

interface CustomersDashboardProps {
  initialCustomers?: Customer[];
}

export function CustomersDashboard({ initialCustomers = [] }: CustomersDashboardProps) {
  // State
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [loading, setLoading] = useState(!initialCustomers.length);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/crm/customers', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialCustomers.length) {
      fetchCustomers();
    }
  }, [fetchCustomers, initialCustomers.length]);

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter(customer =>
      customer.firstName.toLowerCase().includes(query) ||
      customer.lastName.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      (customer.phone && customer.phone.includes(query))
    );
  }, [customers, searchQuery]);

  // Selection handlers
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredCustomers.map(c => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [filteredCustomers]);

  const handleSelectOne = useCallback((customerId: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(customerId);
      } else {
        next.delete(customerId);
      }
      return next;
    });
  }, []);

  // Customer CRUD handlers
  const handleCustomerCreated = useCallback((customer: Customer) => {
    setCustomers(prev => [customer, ...prev]);
    setShowAddModal(false);
  }, []);

  const handleCustomerClick = useCallback((customerId: string) => {
    // TODO: Open customer detail modal
    console.log('Customer clicked:', customerId);
  }, []);

  // Bulk delete
  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} customer(s)?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedIds).map(id =>
        fetch(`/api/crm/customers/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      );

      await Promise.all(deletePromises);

      setCustomers(prev => prev.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    } catch (err) {
      setError('Failed to delete some customers');
    }
  }, [selectedIds]);

  // Stats
  const stats = useMemo(() => ({
    total: customers.length,
    filtered: filteredCustomers.length,
    subscribed: customers.filter(c => c.marketing.emailSubscribed).length,
  }), [customers, filteredCustomers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-xl">👥</span>
            Customers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total} customers · {stats.filtered === stats.total ? '100%' : `${filteredCustomers.length} shown`} of your customer base
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportCustomersButton
            customers={selectedIds.size > 0
              ? filteredCustomers.filter(c => selectedIds.has(c.id))
              : filteredCustomers
            }
            disabled={filteredCustomers.length === 0}
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add customer
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <CustomerSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search customers..."
        />
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-700">
            {selectedIds.size} selected
          </span>

          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear selection
          </button>

          <div className="flex-1" />

          <button
            onClick={handleBulkDelete}
            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            Delete selected
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchCustomers}
            className="mt-2 text-sm text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      {/* Customers Table */}
      {!loading && filteredCustomers.length > 0 && (
        <CustomersTable
          customers={filteredCustomers}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onCustomerClick={handleCustomerClick}
        />
      )}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900">No customers yet</h3>
          <p className="text-gray-500 mt-1">
            Add your first customer to get started.
          </p>
          <div className="mt-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
            >
              Add customer
            </button>
          </div>
        </div>
      )}

      {/* No Results State */}
      {!loading && customers.length > 0 && filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
          <p className="text-gray-500 mt-1">
            Try adjusting your search.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onCustomerCreated={handleCustomerCreated}
        />
      )}
    </div>
  );
}
