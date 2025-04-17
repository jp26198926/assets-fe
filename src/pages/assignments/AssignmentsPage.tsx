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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, ArrowRightLeft, Search } from "lucide-react";
import { useAssignmentsApi } from "@/hooks/useAssignmentsApi";
import { useItemsApi } from "@/hooks/useItemsApi";
import { useRoomsApi } from "@/hooks/useRoomsApi";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const AssignmentsPage: React.FC = () => {
  const { useAssignments, useCreateAssignment, useUpdateAssignmentStatus } =
    useAssignmentsApi();
  const { useItems } = useItemsApi();
  const { useRooms } = useRoomsApi();

  const { data: assignments, isLoading } = useAssignments();
  const { data: items } = useItems();
  const { data: rooms } = useRooms();

  const { mutate: createAssignment, isPending: isCreating } =
    useCreateAssignment();
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAssignmentStatus();

  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssignments = assignments?.filter((assignment: any) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      assignment.date.toLowerCase().includes(lowerCaseQuery) ||
      assignment.remarks?.toLowerCase().includes(lowerCaseQuery) ||
      assignment.status.toLowerCase().includes(lowerCaseQuery) ||
      (assignment.itemId &&
        typeof assignment.itemId === "object" &&
        assignment.itemId.itemName.toLowerCase().includes(lowerCaseQuery)) ||
      (assignment.itemId.itemTypeId &&
        typeof assignment.itemId.itemTypeId === "object" &&
        assignment.itemId.itemTypeId.type
          .toLowerCase()
          .includes(lowerCaseQuery)) ||
      (assignment.roomId &&
        typeof assignment.roomId === "object" &&
        assignment.roomId.room.toLowerCase().includes(lowerCaseQuery))
    );
  });

  const assignForm = useForm({
    defaultValues: {
      itemId: "",
      roomId: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
    },
  });

  const statusForm = useForm({
    defaultValues: {
      status: "",
      reason: "",
    },
  });

  const handleCreateAssignment = (data: any) => {
    createAssignment(
      {
        date: new Date(data.date).toISOString(),
        itemId: data.itemId,
        roomId: data.roomId,
        remarks: data.remarks,
      },
      {
        onSuccess: () => {
          assignForm.reset();
          setShowAssignForm(false);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.error || "Failed to create assignment",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleChangeStatus = (data: any) => {
    if (!selectedAssignment) return;

    updateStatus(
      {
        id: selectedAssignment._id,
        status: data.status,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          statusForm.reset();
          setShowStatusForm(false);
          setSelectedAssignment(null);
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.error ||
              "Failed to update assignment status",
            variant: "destructive",
          });
        },
      }
    );
  };

  // Filter only active items that are not already assigned
  const availableItems =
    items?.filter((item: any) => item.status === "Active") || [];

  // Filter only active rooms
  const availableRooms =
    rooms?.filter((room: any) => room.status === "Active") || [];

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assignments</h1>

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
          <Button onClick={() => setShowAssignForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Assign Item
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Assignments</CardTitle>
          <CardDescription>Manage item assignments to rooms</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item Type</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments && filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment: any) => (
                      <TableRow key={assignment._id}>
                        <TableCell>
                          {format(new Date(assignment.date), "yyyy-MM-dd")}
                        </TableCell>

                        <TableCell>
                          {assignment.itemId.typeId
                            ? assignment.itemId.typeId.type
                            : "Unknown Type"}
                        </TableCell>

                        <TableCell>
                          {assignment.itemId
                            ? `${assignment.itemId.itemName} (${assignment.itemId.serialNo})`
                            : "Unknown Item"}
                        </TableCell>

                        <TableCell>
                          {assignment.roomId
                            ? assignment.roomId.room
                            : "Unknown Room"}
                        </TableCell>
                        <TableCell>
                          {assignment.assignedBy
                            ? `${assignment.assignedBy.firstname} ${assignment.assignedBy.lastname}`
                            : "Unknown"}
                        </TableCell>

                        <TableCell>
                          {assignment.remarks ? `${assignment.remarks}` : ""}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              assignment.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : assignment.status === "Transferred"
                                ? "bg-yellow-100 text-yellow-800"
                                : assignment.status === "Surrendered"
                                ? "bg-blue-100 text-blue-800"
                                : assignment.status === "Deleted"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {assignment.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {assignment.status === "Active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setShowStatusForm(true);
                              }}
                            >
                              <ArrowRightLeft className="mr-1 h-3 w-3" />
                              Change
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No assignments found. Assign items to rooms using the
                        button above.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAssignForm} onOpenChange={setShowAssignForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Item to Room</DialogTitle>
            <DialogDescription>
              Select an item and a room to create a new assignment
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={assignForm.handleSubmit(handleCreateAssignment)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <label htmlFor="itemId" className="text-sm font-medium">
                Select Item
              </label>
              <Select
                onValueChange={(value) => assignForm.setValue("itemId", value)}
                value={assignForm.watch("itemId")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.length > 0 ? (
                    availableItems.map((item: any) => (
                      <SelectItem key={item._id} value={item._id}>
                        {item.itemName} - {item.serialNo}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No available items
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {assignForm.formState.errors.itemId && (
                <p className="text-red-500 text-sm">
                  {assignForm.formState.errors.itemId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="roomId" className="text-sm font-medium">
                Select Room
              </label>
              <Select
                onValueChange={(value) => assignForm.setValue("roomId", value)}
                value={assignForm.watch("roomId")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.length > 0 ? (
                    availableRooms.map((room: any) => (
                      <SelectItem key={room._id} value={room._id}>
                        {room.room}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No available rooms
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {assignForm.formState.errors.roomId && (
                <p className="text-red-500 text-sm">
                  {assignForm.formState.errors.roomId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Assignment Date
              </label>
              <Input
                id="date"
                type="date"
                {...assignForm.register("date", {
                  required: "Date is required",
                })}
              />
              {assignForm.formState.errors.date && (
                <p className="text-red-500 text-sm">
                  {assignForm.formState.errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="remarks" className="text-sm font-medium">
                Remarks
              </label>
              <textarea
                id="remarks"
                rows={4} // optional: controls height
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...assignForm.register("remarks")}
              />
              {assignForm.formState.errors.remarks && (
                <p className="text-red-500 text-sm">
                  {assignForm.formState.errors.remarks.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  assignForm.reset();
                  setShowAssignForm(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create Assignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showStatusForm}
        onOpenChange={(open) => !open && setShowStatusForm(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Assignment Status</DialogTitle>
            <DialogDescription>
              Change the status of this assignment
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={statusForm.handleSubmit(handleChangeStatus)}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                New Status
              </label>
              <Select
                onValueChange={(value) => statusForm.setValue("status", value)}
                value={statusForm.watch("status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Surrendered">Surrendered</SelectItem>
                  <SelectItem value="Transferred">Transferred</SelectItem>
                  <SelectItem value="Deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
              {statusForm.formState.errors.status && (
                <p className="text-red-500 text-sm">
                  {statusForm.formState.errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason
              </label>
              <Textarea
                id="reason"
                placeholder="Provide a reason for this status change"
                {...statusForm.register("reason")}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  statusForm.reset();
                  setShowStatusForm(false);
                  setSelectedAssignment(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Status
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentsPage;
