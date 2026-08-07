import { apiClient } from "../../../shared/api/client";
import type {
  PaginatedResponse,
  Vehicle,
  VehicleListParams,
  VehiclePayload,
} from "../types";

export async function listVehicles(
  params: VehicleListParams,
): Promise<PaginatedResponse<Vehicle>> {
  const { data } = await apiClient.get<PaginatedResponse<Vehicle>>(
    "/vehicles",
    { params },
  );
  return data;
}

export async function getVehicle(id: number): Promise<Vehicle> {
  const { data } = await apiClient.get<{ data: Vehicle }>(`/vehicles/${id}`);
  return data.data;
}

export async function createVehicle(payload: VehiclePayload): Promise<Vehicle> {
  const { data } = await apiClient.post<{ data: Vehicle }>(
    "/vehicles",
    payload,
  );
  return data.data;
}

export async function updateVehicle(
  id: number,
  payload: VehiclePayload,
): Promise<Vehicle> {
  const { data } = await apiClient.put<{ data: Vehicle }>(
    `/vehicles/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteVehicle(id: number): Promise<void> {
  await apiClient.delete(`/vehicles/${id}`);
}
