
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader2, Plus } from 'lucide-react';
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

type UserFormValues = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: 'Admin' | 'User';
};

interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormValues) => void;
  isCreating: boolean;
}

const NewUserDialog: React.FC<NewUserDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isCreating
}) => {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserFormValues>({
    defaultValues: {
      role: 'User'
    }
  });

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!open) {
      reset({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        role: 'User'
      });
    }
  }, [open, reset]);

  const handleClose = () => {
    reset({
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      role: 'User'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Create a new user account
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Controller
              name="role"
              control={control}
              defaultValue="User"
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
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
            <Button type="submit" disabled={isCreating}>
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewUserDialog;
