import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { toast } from "@/hooks/use-toast";

export type Assignment = {
  _id: string;
  date: string;
  itemId: any;
  roomId: any;
  assignedBy: any;
  remarks: any;
  status: "Active" | "Deleted" | "Transferred" | "Surrendered";
  createdAt: string;
};

export const useAssignmentsApi = () => {
  const queryClient = useQueryClient();

  const fetchAssignments = async () => {
    const response = await api.get("/api/assignments");
    return response.data;
  };

  const createAssignment = async (assignmentData: {
    date: string;
    itemId: string;
    roomId: string;
    remarks: string;
  }) => {
    const response = await api.post("/api/assignments", assignmentData);
    return response.data;
  };

  const updateAssignmentStatus = async ({
    id,
    status,
    reason,
  }: {
    id: string;
    status: "Transferred" | "Surrendered" | "Deleted";
    reason?: string;
  }) => {
    const response = await api.put(`/api/assignments/${id}/status`, {
      status,
      reason,
    });
    return response.data;
  };

  const useAssignments = () =>
    useQuery({
      queryKey: ["assignments"],
      queryFn: fetchAssignments,
    });

  const useCreateAssignment = () =>
    useMutation({
      mutationFn: createAssignment,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Assignment created successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["assignments"] });
        queryClient.invalidateQueries({ queryKey: ["items"] });
      },
    });

  const useUpdateAssignmentStatus = () =>
    useMutation({
      mutationFn: updateAssignmentStatus,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Assignment status updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["assignments"] });
        queryClient.invalidateQueries({ queryKey: ["items"] });
      },
    });

  return {
    useAssignments,
    useCreateAssignment,
    useUpdateAssignmentStatus,
  };
};
