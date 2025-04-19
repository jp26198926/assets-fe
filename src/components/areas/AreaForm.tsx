
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Area } from '@/hooks/useAreasApi';

interface AreaFormProps {
  editingArea: Area | null;
  isCreating: boolean;
  isUpdating: boolean;
  onSubmit: (data: { area: string }) => void;
  onCancel: () => void;
}

const AreaForm: React.FC<AreaFormProps> = ({
  editingArea,
  isCreating,
  isUpdating,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      area: editingArea?.area || ''
    }
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{editingArea ? 'Edit Area' : 'Add New Area'}</CardTitle>
        <CardDescription>
          {editingArea ? 'Update area details' : 'Create a new area in the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="area" className="text-sm font-medium">
              Area Name
            </label>
            <Input
              id="area"
              placeholder="Enter area name or number"
              {...register("area", { required: "Area name is required" })}
              className={errors.area ? "border-red-500" : ""}
            />
            {errors.area && (
              <p className="text-red-500 text-sm">{errors.area.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editingArea ? (
                <Pencil className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {editingArea ? 'Update Area' : 'Create Area'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AreaForm;
