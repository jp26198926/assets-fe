
import React, { useEffect } from 'react';
import { User } from '@/hooks/useUsersApi';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, FileEdit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UpdateUserFormValues = {
  email: string;
  firstname: string;
  lastname: string;
  role: 'Admin' | 'User';
};

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateUserFormValues) => void;
  isUpdating: boolean;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSubmit,
  isUpdating
}) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UpdateUserFormValues>();

  // Reset form and populate with user data when dialog opens
  useEffect(() => {
    if (user && open) {
      reset({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role as 'Admin' | 'User'
      });
    }
  }, [user, reset, open]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstname" className="text-sm font-medium">
                First Name
              </label>
              <Input
                id="firstname"
                {...register("firstname", { required: "First name is required" })}
                className={errors.firstname ? "border-red-500" : ""}
              />
              {errors.firstname && (
                <p className="text-red-500 text-sm">{errors.firstname.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastname" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastname"
                {...register("lastname", { required: "Last name is required" })}
                className={errors.lastname ? "border-red-500" : ""}
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm">{errors.lastname.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileEdit className="mr-2 h-4 w-4" />}
              Update User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
