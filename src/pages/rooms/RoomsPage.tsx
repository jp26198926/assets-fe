import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2, Pencil, Trash2, Search } from "lucide-react";
import { useRoomsApi, Room } from "@/hooks/useRoomsApi";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

const RoomsPage: React.FC = () => {
  const { useRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } =
    useRoomsApi();
  const { data: rooms, isLoading } = useRooms();
  const { mutate: createRoom, isPending: isCreating } = useCreateRoom();
  const { mutate: updateRoom, isPending: isUpdating } = useUpdateRoom();
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom();

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      room: "",
    },
  });

  const filteredRooms = rooms?.filter((room: any) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      room.room.toLowerCase().includes(lowerCaseQuery) ||
      room.status.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const onSubmit = (data: { room: string }) => {
    if (editingRoom) {
      updateRoom(
        {
          id: editingRoom._id,
          data: data,
        },
        {
          onSuccess: () => {
            reset();
            setEditingRoom(null);
            setShowForm(false);
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error.response?.data?.error || "Failed to update room",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createRoom(data, {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.response?.data?.error || "Failed to create room",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setValue("room", room.room);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (roomToDelete) {
      deleteRoom(
        {
          id: roomToDelete._id,
          reason: deleteReason,
        },
        {
          onSuccess: () => {
            setRoomToDelete(null);
            setDeleteReason("");
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error.response?.data?.error || "Failed to delete room",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const cancelForm = () => {
    reset();
    setEditingRoom(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[300px]"
            />
          </div>
          <Button
            onClick={() => (!showForm ? setShowForm(true) : cancelForm())}
          >
            <Plus className="mr-2 h-4 w-4" /> {showForm ? "Cancel" : "Add Room"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingRoom ? "Edit Room" : "Add New Room"}</CardTitle>
            <CardDescription>
              {editingRoom
                ? "Update room details"
                : "Create a new room in the system"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="room" className="text-sm font-medium">
                  Room Name
                </label>
                <Input
                  id="room"
                  placeholder="Enter room name or number"
                  {...register("room", { required: "Room name is required" })}
                  className={errors.room ? "border-red-500" : ""}
                />
                {errors.room && (
                  <p className="text-red-500 text-sm">{errors.room.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : editingRoom ? (
                    <Pencil className="mr-2 h-4 w-4" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {editingRoom ? "Update Room" : "Create Room"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
          <CardDescription>View all rooms in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms && filteredRooms.length > 0 ? (
                  filteredRooms.map((room: Room) => (
                    <TableRow key={room._id}>
                      <TableCell className="font-medium">{room.room}</TableCell>
                      <TableCell>{room.status}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(room)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setRoomToDelete(room)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      No rooms found. Create some using the button above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!roomToDelete}
        onOpenChange={(open) => !open && setRoomToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this room?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please provide a reason for
              deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Reason for deletion"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting || !deleteReason.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomsPage;
