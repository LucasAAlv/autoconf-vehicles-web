import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVehicle } from "../api/vehiclesApi";

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
}
