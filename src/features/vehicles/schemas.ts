import { z } from "zod";

const PLACA_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i;
const CHASSI_REGEX = /^[A-Za-z0-9]{17}$/;

export const cambioOptions = ["manual", "automatico"] as const;

export const combustivelOptions = [
  "gasolina",
  "alcool",
  "flex",
  "diesel",
  "hibrido",
  "eletrico",
] as const;

// Mirrors StoreVehicleRequest/UpdateVehicleRequest on the API — same regex,
// same limits. valor_venda/km are typed as numbers in the form (the API
// sends valor_venda back as a string, but takes a plain numeric value in).
export const vehicleSchema = z.object({
  placa: z
    .string()
    .min(1, "Informe a placa")
    .regex(PLACA_REGEX, "Placa inválida (formato Mercosul, ex.: ABC1D23)")
    .transform((value) => value.toUpperCase()),
  chassi: z
    .string()
    .min(1, "Informe o chassi")
    .regex(CHASSI_REGEX, "Chassi precisa ter 17 caracteres alfanuméricos")
    .transform((value) => value.toUpperCase()),
  marca: z.string().min(1, "Informe a marca"),
  modelo: z.string().min(1, "Informe o modelo"),
  versao: z.string().min(1, "Informe a versão"),
  valor_venda: z.coerce
    .number({ message: "Informe o valor de venda" })
    .min(0.01, "O valor de venda precisa ser maior que zero"),
  cor: z.string().min(1, "Informe a cor"),
  km: z.coerce
    .number({ message: "Informe a quilometragem" })
    .int("Km precisa ser um número inteiro")
    .min(0, "Km não pode ser negativo"),
  cambio: z.enum(cambioOptions, { message: "Selecione o câmbio" }),
  combustivel: z.enum(combustivelOptions, {
    message: "Selecione o combustível",
  }),
});

export type VehicleFormValues = z.output<typeof vehicleSchema>;
export type VehicleFormInput = z.input<typeof vehicleSchema>;
