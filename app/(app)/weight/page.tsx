"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/Button"
import { WeightStatsCard } from "@/components/molecules/WeightStatsCard"
import { WeightChart } from "@/components/organisms/WeightChart"
import { WeightHistory } from "@/components/organisms/WeightHistory"
import { WeightEntryForm } from "@/components/organisms/WeightEntryForm"
import {
  useGetWeightEntriesQuery,
  useGetWeightStatsQuery,
  useCreateWeightEntryMutation,
  useUpdateWeightEntryMutation,
  useDeleteWeightEntryMutation,
} from "@/store/api/weightApi"
import { WeightEntry } from "@/types"
import { PlusIcon } from "@heroicons/react/24/outline"
import * as Dialog from "@radix-ui/react-dialog"
import { XMarkIcon } from "@heroicons/react/24/solid"

export default function WeightPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<WeightEntry | undefined>(undefined)

  const { data: entries = [], isLoading: entriesLoading } = useGetWeightEntriesQuery()
  const { data: stats, isLoading: statsLoading } = useGetWeightStatsQuery()

  const [createEntry, { isLoading: creating }] = useCreateWeightEntryMutation()
  const [updateEntry, { isLoading: updating }] = useUpdateWeightEntryMutation()
  const [deleteEntry] = useDeleteWeightEntryMutation()

  const handleOpenModal = () => {
    setEditingEntry(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (entry: WeightEntry) => {
    setEditingEntry(entry)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingEntry(undefined)
  }

  const handleSubmit = async (data: { weight_kg: number; measured_at: string; notes?: string }) => {
    try {
      if (editingEntry) {
        await updateEntry({ id: editingEntry.id, data }).unwrap()
      } else {
        await createEntry(data).unwrap()
      }
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save weight entry:', error)
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id).unwrap()
    } catch (error) {
      console.error('Failed to delete weight entry:', error)
    }
  }

  return (
    <div className="min-h-screen bg-ocean-900 pb-20">
      {/* Header */}
      <header className="bg-ocean-800 border-b border-ocean-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Weight Tracking</h1>
          <Button onClick={handleOpenModal} size="sm">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Weight
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <WeightStatsCard
            label="Current Weight"
            value={stats?.current_weight || 0}
            loading={statsLoading}
          />
          <WeightStatsCard
            label="7-Day Average"
            value={stats?.weight_7day_avg || 0}
            loading={statsLoading}
          />
          <WeightStatsCard
            label="30-Day Average"
            value={stats?.weight_30day_avg || 0}
            loading={statsLoading}
          />
          <WeightStatsCard
            label="Total Change"
            value={Math.abs(stats?.total_change || 0)}
            change={stats?.total_change}
            changeLabel="overall"
            loading={statsLoading}
          />
        </div>

        {/* Chart */}
        <WeightChart entries={entries} loading={entriesLoading} />

        {/* History */}
        <WeightHistory
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={entriesLoading}
        />
      </main>

      {/* Add/Edit Weight Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-fadeIn" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ocean-800 rounded-lg shadow-xl border border-ocean-700 p-6 w-full max-w-md z-50 animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-bold">
                {editingEntry ? "Edit Weight Entry" : "Add Weight Entry"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-ocean-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>
            <WeightEntryForm
              entry={editingEntry}
              onSubmit={handleSubmit}
              onCancel={handleCloseModal}
              loading={creating || updating}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
