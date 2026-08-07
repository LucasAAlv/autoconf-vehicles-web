import { useQuery } from "@tanstack/react-query";
import { listVehicles } from "../api/vehiclesApi";
import type { VehicleListParams } from "../types";

export function useVehicles(params: VehicleListParams) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => listVehicles(params),
    placeholderData: (previousData) => previousData,
  });
}
