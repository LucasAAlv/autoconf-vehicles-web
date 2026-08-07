import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadVehicleImages } from "../api/vehicleImagesApi";

export function useUploadImages(vehicleId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => uploadVehicleImages(vehicleId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
    },
  });
}
