import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCoverImage } from "../api/vehicleImagesApi";
import type { Vehicle } from "../types";

export function useSetCoverImage(vehicleId: number) {
  const queryClient = useQueryClient();
  const queryKey = ["vehicle", vehicleId];

  return useMutation({
    mutationFn: (imageId: number) => setCoverImage(vehicleId, imageId),
    onMutate: async (imageId: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Vehicle>(queryKey);

      if (previous?.images) {
        queryClient.setQueryData<Vehicle>(queryKey, {
          ...previous,
          images: previous.images.map((image) => ({
            ...image,
            is_cover: image.id === imageId,
          })),
        });
      }

      return { previous };
    },
    onError: (_error, _imageId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
