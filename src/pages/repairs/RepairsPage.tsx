
import React from 'react';
import { useRepairsState } from '@/hooks/useRepairsState';
import RepairsHeader from '@/components/repairs/RepairsHeader';
import RepairsContent from '@/components/repairs/RepairsContent';
import NewRepairDialog from '@/components/repairs/NewRepairDialog';
import CompleteRepairDialog from '@/components/repairs/CompleteRepairDialog';
import DefectiveRepairDialog from '@/components/repairs/DefectiveRepairDialog';
import DeleteRepairDialog from '@/components/repairs/DeleteRepairDialog';

const RepairsPage: React.FC = () => {
  const {
    repairs,
    items,
    isLoading,
    isCreating,
    isCompleting,
    isMarking,
    isDeleting,
    showNewRepairForm,
    showDiagnosisForm,
    showDefectiveForm,
    showDeleteDialog,
    selectedRepair,
    searchQuery,
    filters,
    setShowNewRepairForm,
    setShowDiagnosisForm,
    setShowDefectiveForm,
    setShowDeleteDialog,
    setSelectedRepair,
    setSearchQuery,
    handleCreate,
    handleComplete,
    handleMarkDefective,
    handleDelete,
    handleAdvancedFilterChange,
    resetFilters
  } = useRepairsState();

  // Handle dialog closing to ensure proper cleanup
  const handleCloseNewRepairDialog = () => {
    setShowNewRepairForm(false);
  };

  const handleCloseDiagnosisForm = () => {
    setShowDiagnosisForm(false);
    // Clear selected repair after a delay to prevent UI flicker
    setTimeout(() => {
      setSelectedRepair(null);
    }, 300);
  };

  const handleCloseDefectiveForm = () => {
    setShowDefectiveForm(false);
    // Clear selected repair after a delay to prevent UI flicker
    setTimeout(() => {
      setSelectedRepair(null);
    }, 300);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    // Clear selected repair after a delay
    setTimeout(() => {
      setSelectedRepair(null);
    }, 300);
  };

  return (
    <div className="container mx-auto py-6">
      <RepairsHeader
        searchQuery={searchQuery}
        filters={filters}
        onSearchChange={setSearchQuery}
        onFilterChange={handleAdvancedFilterChange}
        onReset={resetFilters}
        onNewRepair={() => setShowNewRepairForm(true)}
        filteredRepairs={repairs}
      />

      <RepairsContent
        repairs={repairs}
        isLoading={isLoading}
        searchQuery={searchQuery}
        filters={filters}
        onCompleteRepair={(repair) => {
          setSelectedRepair(repair);
          setShowDiagnosisForm(true);
        }}
        onMarkDefective={(repair) => {
          setSelectedRepair(repair);
          setShowDefectiveForm(true);
        }}
        onDeleteRepair={(repair) => {
          setSelectedRepair(repair);
          setShowDeleteDialog(true);
        }}
      />

      <NewRepairDialog
        open={showNewRepairForm}
        onOpenChange={handleCloseNewRepairDialog}
        onSubmit={handleCreate}
        isCreating={isCreating}
        items={items}
      />

      <CompleteRepairDialog
        open={showDiagnosisForm}
        onOpenChange={handleCloseDiagnosisForm}
        onSubmit={handleComplete}
        isCompleting={isCompleting}
        selectedRepair={selectedRepair}
      />

      <DefectiveRepairDialog
        open={showDefectiveForm}
        onOpenChange={handleCloseDefectiveForm}
        onSubmit={handleMarkDefective}
        isMarking={isMarking}
        selectedRepair={selectedRepair}
      />

      <DeleteRepairDialog
        open={showDeleteDialog}
        onOpenChange={handleCloseDeleteDialog}
        onSubmit={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default RepairsPage;
