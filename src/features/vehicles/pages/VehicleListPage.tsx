import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { formatCurrency, formatKm } from "../../../shared/format";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { useVehicles } from "../hooks/useVehicles";

const PER_PAGE = 10;

type SortField = "km" | "valor_venda" | "marca" | "modelo";
type SortDirection = "asc" | "desc";

export function VehicleListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [sort, setSort] = useState<{
    field: SortField;
    direction: SortDirection;
  } | null>(null);

  const debouncedQ = useDebouncedValue(q);
  const debouncedMarca = useDebouncedValue(marca);
  const debouncedModelo = useDebouncedValue(modelo);
  const debouncedPlaca = useDebouncedValue(placa);

  const hasActiveFilters = Boolean(
    debouncedQ || debouncedMarca || debouncedModelo || debouncedPlaca,
  );

  const params = useMemo(
    () => ({
      page,
      per_page: PER_PAGE,
      q: debouncedQ || undefined,
      marca: debouncedMarca || undefined,
      modelo: debouncedModelo || undefined,
      placa: debouncedPlaca || undefined,
      sort: sort
        ? `${sort.direction === "desc" ? "-" : ""}${sort.field}`
        : undefined,
    }),
    [page, debouncedQ, debouncedMarca, debouncedModelo, debouncedPlaca, sort],
  );

  const { data, isLoading, isError, error, isFetching, refetch } =
    useVehicles(params);

  function toggleSort(field: SortField) {
    setPage(1);
    setSort((current) => {
      if (current?.field !== field) return { field, direction: "asc" };
      if (current.direction === "asc") return { field, direction: "desc" };
      return null;
    });
  }

  function clearFilters() {
    setQ("");
    setMarca("");
    setModelo("");
    setPlaca("");
    setPage(1);
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
      >
        <Typography variant="h4">Veículos</Typography>
        <Button
          component={RouterLink}
          to="/vehicles/new"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Novo veículo
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Buscar (placa, marca, modelo)"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            fullWidth
          />
          <TextField
            label="Marca"
            value={marca}
            onChange={(e) => {
              setPage(1);
              setMarca(e.target.value);
            }}
          />
          <TextField
            label="Modelo"
            value={modelo}
            onChange={(e) => {
              setPage(1);
              setModelo(e.target.value);
            }}
          />
          <TextField
            label="Placa"
            value={placa}
            onChange={(e) => {
              setPage(1);
              setPlaca(e.target.value);
            }}
            slotProps={{
              input: {
                endAdornment: hasActiveFilters && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={clearFilters}
                      aria-label="Limpar filtros"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </Paper>

      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Tentar de novo
            </Button>
          }
        >
          Não foi possível carregar os veículos.{" "}
          {(error as Error)?.message ?? ""}
        </Alert>
      )}

      {isLoading ? (
        <Stack spacing={1}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={53} />
          ))}
        </Stack>
      ) : data && data.data.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
          <Typography color="text.secondary">
            {hasActiveFilters
              ? "Nenhum veículo encontrado para esses filtros."
              : "Nenhum veículo cadastrado ainda."}
          </Typography>
        </Paper>
      ) : (
        data && (
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 0.2s" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Placa</TableCell>
                  <TableCell
                    sortDirection={
                      sort?.field === "marca" ? sort.direction : false
                    }
                  >
                    <TableSortLabel
                      active={sort?.field === "marca"}
                      direction={
                        sort?.field === "marca" ? sort.direction : "asc"
                      }
                      onClick={() => toggleSort("marca")}
                    >
                      Marca
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      sort?.field === "modelo" ? sort.direction : false
                    }
                  >
                    <TableSortLabel
                      active={sort?.field === "modelo"}
                      direction={
                        sort?.field === "modelo" ? sort.direction : "asc"
                      }
                      onClick={() => toggleSort("modelo")}
                    >
                      Modelo
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      sort?.field === "valor_venda" ? sort.direction : false
                    }
                  >
                    <TableSortLabel
                      active={sort?.field === "valor_venda"}
                      direction={
                        sort?.field === "valor_venda" ? sort.direction : "asc"
                      }
                      onClick={() => toggleSort("valor_venda")}
                    >
                      Valor
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={
                      sort?.field === "km" ? sort.direction : false
                    }
                  >
                    <TableSortLabel
                      active={sort?.field === "km"}
                      direction={sort?.field === "km" ? sort.direction : "asc"}
                      onClick={() => toggleSort("km")}
                    >
                      Km
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((vehicle) => (
                  <TableRow
                    key={vehicle.id}
                    hover
                    onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{vehicle.placa}</TableCell>
                    <TableCell>{vehicle.marca}</TableCell>
                    <TableCell>{vehicle.modelo}</TableCell>
                    <TableCell>{formatCurrency(vehicle.valor_venda)}</TableCell>
                    <TableCell>{formatKm(vehicle.km)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {data && data.meta.last_page > 1 && (
        <Box display="flex" justifyContent="center">
          <Pagination
            count={data.meta.last_page}
            page={data.meta.current_page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Stack>
  );
}
