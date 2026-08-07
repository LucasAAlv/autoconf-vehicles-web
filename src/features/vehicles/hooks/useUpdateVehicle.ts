import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVehicle } from "../api/vehiclesApi";
import type { VehiclePayload } from "../types";

export function useUpdateVehicle(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VehiclePayload) => updateVehicle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
    },
  });
}
