export type Cambio = "manual" | "automatico";

export type Combustivel =
  "gasolina" | "alcool" | "flex" | "diesel" | "hibrido" | "eletrico";

export interface VehicleImage {
  id: number;
  path: string;
  url: string;
  is_cover: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleAuthor {
  id: number;
  name: string;
}

export interface Vehicle {
  id: number;
  placa: string;
  chassi: string;
  marca: string;
  modelo: string;
  versao: string;
  valor_venda: string;
  cor: string;
  km: number;
  cambio: Cambio;
  combustivel: Combustivel;
  user_id: number;
  created_at: string;
  updated_at: string;
  creator?: VehicleAuthor;
  updater?: VehicleAuthor;
  images?: VehicleImage[];
}

export interface VehiclePayload {
  placa: string;
  chassi: string;
  marca: string;
  modelo: string;
  versao: string;
  valor_venda: string;
  cor: string;
  km: number;
  cambio: Cambio;
  combustivel: Combustivel;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface VehicleListParams {
  q?: string;
  marca?: string;
  modelo?: string;
  placa?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}
