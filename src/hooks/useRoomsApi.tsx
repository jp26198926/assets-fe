import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { toast } from "@/hooks/use-toast";

export type Room = {
  _id: string;
  room: string;
  status: string;
  createdAt: string;
};

export const useRoomsApi = () => {
  const queryClient = useQueryClient();

  const fetchRooms = async () => {
    const response = await api.get("/api/rooms");
    return response.data;
  };

  const createRoom = async (roomData: { room: string }) => {
    const response = await api.post("/api/rooms", roomData);
    return response.data;
  };

  const updateRoom = async ({
    id,
    data,
  }: {
    id: string;
    data: { room: string };
  }) => {
    const response = await api.put(`/api/rooms/${id}`, data);
    return response.data;
  };

  const deleteRoom = async ({ id, reason }: { id: string; reason: string }) => {
    const response = await api.delete(`/api/rooms/${id}`, {
      data: { reason },
    });
    return response.data;
  };

  const useRooms = () =>
    useQuery({
      queryKey: ["rooms"],
      queryFn: fetchRooms,
    });

  const useCreateRoom = () =>
    useMutation({
      mutationFn: createRoom,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Room created successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
      },
    });

  const useUpdateRoom = () =>
    useMutation({
      mutationFn: updateRoom,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Room updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
      },
    });

  const useDeleteRoom = () =>
    useMutation({
      mutationFn: deleteRoom,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Room deleted successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
      },
    });

  return {
    useRooms,
    useCreateRoom,
    useUpdateRoom,
    useDeleteRoom,
  };
};
