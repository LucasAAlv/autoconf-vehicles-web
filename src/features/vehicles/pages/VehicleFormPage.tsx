import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { VehicleForm } from "../components/VehicleForm";
import { useCreateVehicle } from "../hooks/useCreateVehicle";
import { useUpdateVehicle } from "../hooks/useUpdateVehicle";
import { useVehicle } from "../hooks/useVehicle";

export function VehicleFormPage() {
  const { id } = useParams<{ id: string }>();
  const vehicleId = id ? Number(id) : null;
  const navigate = useNavigate();

  const existing = useVehicle(vehicleId ?? NaN);
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle(vehicleId ?? NaN);

  if (vehicleId && existing.isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {vehicleId ? "Editar veículo" : "Novo veículo"}
      </Typography>

      <VehicleForm
        submitLabel={vehicleId ? "Salvar alterações" : "Criar veículo"}
        defaultValues={
          vehicleId && existing.data
            ? {
                placa: existing.data.placa,
                chassi: existing.data.chassi,
                marca: existing.data.marca,
                modelo: existing.data.modelo,
                versao: existing.data.versao,
                valor_venda: Number(existing.data.valor_venda),
                cor: existing.data.cor,
                km: existing.data.km,
                cambio: existing.data.cambio,
                combustivel: existing.data.combustivel,
              }
            : undefined
        }
        onSubmit={async (payload) => {
          const vehicle = vehicleId
            ? await updateVehicle.mutateAsync(payload)
            : await createVehicle.mutateAsync(payload);
          navigate(`/vehicles/${vehicle.id}`, { replace: true });
        }}
      />
    </Box>
  );
}
