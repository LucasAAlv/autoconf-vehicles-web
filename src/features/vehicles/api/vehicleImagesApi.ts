import { apiClient } from "../../../shared/api/client";
import type { VehicleImage } from "../types";

export async function uploadVehicleImages(
  vehicleId: number,
  files: File[],
): Promise<VehicleImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files[]", file));

  const { data } = await apiClient.post<{ data: VehicleImage[] }>(
    `/vehicles/${vehicleId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
}

export async function setCoverImage(
  vehicleId: number,
  imageId: number,
): Promise<VehicleImage> {
  const { data } = await apiClient.patch<{ data: VehicleImage }>(
    `/vehicles/${vehicleId}/images/${imageId}/cover`,
  );
  return data.data;
}

export async function deleteVehicleImage(
  vehicleId: number,
  imageId: number,
): Promise<void> {
  await apiClient.delete(`/vehicles/${vehicleId}/images/${imageId}`);
}
