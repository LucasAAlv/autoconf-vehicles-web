import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { applyApiErrors } from "../../../shared/api/applyApiErrors";
import { cambioOptions, combustivelOptions, vehicleSchema } from "../schemas";
import type { VehiclePayload } from "../types";
import type { VehicleFormInput, VehicleFormValues } from "../schemas";

function toPayload(values: VehicleFormValues): VehiclePayload {
  return { ...values, valor_venda: values.valor_venda.toFixed(2) };
}

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormInput>;
  submitLabel: string;
  onSubmit: (payload: VehiclePayload) => Promise<void>;
}

const emptyDefaults: VehicleFormInput = {
  placa: "",
  chassi: "",
  marca: "",
  modelo: "",
  versao: "",
  valor_venda: 0,
  cor: "",
  km: 0,
  cambio: "manual",
  combustivel: "flex",
};

export function VehicleForm({
  defaultValues,
  submitLabel,
  onSubmit,
}: VehicleFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  const generalError = errors.root?.message ?? null;

  async function submit(values: VehicleFormValues) {
    try {
      await onSubmit(toPayload(values));
    } catch (error) {
      const detail = applyApiErrors(error, setError);
      if (detail) setError("root", { message: detail });
    }
  }

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, maxWidth: 640 }}
      component="form"
      onSubmit={handleSubmit(submit)}
    >
      <Stack spacing={2}>
        {generalError && <Alert severity="error">{generalError}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="placa"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Placa"
                error={!!errors.placa}
                helperText={errors.placa?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="chassi"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Chassi"
                error={!!errors.chassi}
                helperText={errors.chassi?.message}
                fullWidth
              />
            )}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="marca"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Marca"
                error={!!errors.marca}
                helperText={errors.marca?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="modelo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Modelo"
                error={!!errors.modelo}
                helperText={errors.modelo?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="versao"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Versão"
                error={!!errors.versao}
                helperText={errors.versao?.message}
                fullWidth
              />
            )}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="cor"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Cor"
                error={!!errors.cor}
                helperText={errors.cor?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="km"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Km"
                type="number"
                error={!!errors.km}
                helperText={errors.km?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="valor_venda"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Valor de venda (R$)"
                type="number"
                slotProps={{ htmlInput: { step: "0.01" } }}
                error={!!errors.valor_venda}
                helperText={errors.valor_venda?.message}
                fullWidth
              />
            )}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            name="cambio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Câmbio"
                error={!!errors.cambio}
                helperText={errors.cambio?.message}
                fullWidth
              >
                {cambioOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="combustivel"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Combustível"
                error={!!errors.combustivel}
                helperText={errors.combustivel?.message}
                fullWidth
              >
                {combustivelOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </Stack>
    </Paper>
  );
}
