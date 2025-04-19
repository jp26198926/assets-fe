import { useState, useEffect } from 'react';
import { useItemsApi } from './useItemsApi';
import { useRepairsApi } from './useRepairsApi';

export const useRepairsState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'Ongoing', // Set default status to Ongoing
    startDate: '',
    endDate: '',
    itemType: ''
  });
  const [showNewRepairForm, setShowNewRepairForm] = useState(false);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [showDefectiveForm, setShowDefectiveForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);

  // API hooks
  const { useItems } = useItemsApi();
  const { 
    useRepairs, 
    useCreateRepair, 
    useCompleteRepair, 
    useMarkDefective,
    useDeleteRepair 
  } = useRepairsApi();

  // Queries
  const { data: items = [], isLoading: isItemsLoading } = useItems();
  const { data: repairs = [], isLoading: isRepairsLoading } = useRepairs();
  
  // Mutations
  const { mutateAsync: createRepair, isPending: isCreating } = useCreateRepair();
  const { mutateAsync: completeRepair, isPending: isCompleting } = useCompleteRepair();
  const { mutateAsync: markDefective, isPending: isMarking } = useMarkDefective();
  const { mutateAsync: deleteRepair, isPending: isDeleting } = useDeleteRepair();

  // Combined loading state
  const isLoading = isItemsLoading || isRepairsLoading;

  // Remove console.log from handleCreate
  const handleCreate = async (data) => {
    await createRepair(data);
    setShowNewRepairForm(false);
  };

  // Handle form submission for completing repair
  const handleComplete = async (data) => {
    if (selectedRepair) {
      await completeRepair({ id: selectedRepair._id, ...data });
      setShowDiagnosisForm(false);
      setSelectedRepair(null);
    }
  };

  // Handle form submission for marking as defective
  const handleMarkDefective = async (data) => {
    if (selectedRepair) {
      await markDefective({ id: selectedRepair._id, ...data });
      setShowDefectiveForm(false);
      setSelectedRepair(null);
    }
  };

  // Handle form submission for deleting repair
  const handleDelete = async (data) => {
    if (selectedRepair) {
      await deleteRepair({ id: selectedRepair._id, ...data });
      setShowDeleteDialog(false);
      setSelectedRepair(null);
    }
  };

  // Handle advanced filter changes
  const handleAdvancedFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'Ongoing',
      startDate: '',
      endDate: '',
      itemType: ''
    });
    setSearchQuery('');
  };

  return {
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
  };
};
