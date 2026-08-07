import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVehicleImage } from "../api/vehicleImagesApi";

export function useDeleteImage(vehicleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: number) => deleteVehicleImage(vehicleId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
    },
  });
}
