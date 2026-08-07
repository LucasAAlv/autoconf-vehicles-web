import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../features/auth/AuthContext";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { formatCurrency, formatKm } from "../../../shared/format";
import { useDeleteVehicle } from "../hooks/useDeleteVehicle";
import { useVehicle } from "../hooks/useVehicle";

const fieldLabels: Record<string, string> = {
  placa: "Placa",
  chassi: "Chassi",
  marca: "Marca",
  modelo: "Modelo",
  versao: "Versão",
  cor: "Cor",
  cambio: "Câmbio",
  combustivel: "Combustível",
};

export function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: vehicle, isLoading, isError } = useVehicle(vehicleId);
  const deleteVehicle = useDeleteVehicle();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !vehicle) {
    return <Alert severity="error">Veículo não encontrado.</Alert>;
  }

  const canManage = user?.is_admin || user?.id === vehicle.user_id;
  const cover = vehicle.images?.find((image) => image.is_cover);

  async function handleDelete() {
    await deleteVehicle.mutateAsync(vehicle!.id);
    navigate("/vehicles", { replace: true });
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
      >
        <Typography variant="h4">
          {vehicle.marca} {vehicle.modelo} — {vehicle.placa}
        </Typography>
        {canManage && (
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<EditOutlinedIcon />}
              onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
            >
              Editar
            </Button>
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              Excluir
            </Button>
          </Stack>
        )}
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          {cover ? (
            <Box
              component="img"
              src={cover.url}
              alt={`Capa de ${vehicle.marca} ${vehicle.modelo}`}
              onClick={() => setLightboxUrl(cover.url)}
              sx={{
                width: "100%",
                borderRadius: 2,
                cursor: "zoom-in",
                aspectRatio: "4 / 3",
                objectFit: "cover",
              }}
            />
          ) : (
            <Paper
              variant="outlined"
              sx={{
                aspectRatio: "4 / 3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">Sem imagens</Typography>
            </Paper>
          )}

          {vehicle.images && vehicle.images.length > 0 && (
            <Grid container spacing={1} mt={0.5}>
              {vehicle.images.map((image) => (
                <Grid key={image.id} size={3}>
                  <Box position="relative">
                    <Box
                      component="img"
                      src={image.url}
                      alt=""
                      onClick={() => setLightboxUrl(image.url)}
                      sx={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        borderRadius: 1,
                        cursor: "zoom-in",
                        outline: image.is_cover ? "2px solid" : "none",
                        outlineColor: "secondary.main",
                      }}
                    />
                    {image.is_cover && (
                      <Chip
                        label="Capa"
                        size="small"
                        color="secondary"
                        sx={{ position: "absolute", bottom: 4, left: 4 }}
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {(
                [
                  "placa",
                  "chassi",
                  "marca",
                  "modelo",
                  "versao",
                  "cor",
                  "cambio",
                  "combustivel",
                ] as const
              ).map((field) => (
                <Grid key={field} size={6}>
                  <Typography variant="caption" color="text.secondary">
                    {fieldLabels[field]}
                  </Typography>
                  <Typography>{vehicle[field]}</Typography>
                </Grid>
              ))}
              <Grid size={6}>
                <Typography variant="caption" color="text.secondary">
                  Valor de venda
                </Typography>
                <Typography>{formatCurrency(vehicle.valor_venda)}</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="caption" color="text.secondary">
                  Km
                </Typography>
                <Typography>{formatKm(vehicle.km)}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Auditoria
            </Typography>
            <Typography variant="body2">
              Criado por {vehicle.creator?.name ?? "—"} em{" "}
              {new Date(vehicle.created_at).toLocaleString("pt-BR")}
            </Typography>
            <Typography variant="body2">
              Última atualização por {vehicle.updater?.name ?? "—"} em{" "}
              {new Date(vehicle.updated_at).toLocaleString("pt-BR")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Excluir veículo"
        description={`Tem certeza que deseja excluir o veículo de placa ${vehicle.placa}? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleteVehicle.isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmDeleteOpen(false)}
      />

      <Dialog
        open={!!lightboxUrl}
        onClose={() => setLightboxUrl(null)}
        maxWidth="lg"
      >
        {lightboxUrl && (
          <Box
            component="img"
            src={lightboxUrl}
            alt=""
            sx={{ maxWidth: "100%", maxHeight: "85vh", display: "block" }}
          />
        )}
      </Dialog>
    </Stack>
  );
}
