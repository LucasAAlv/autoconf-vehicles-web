import { useState, type FormEvent } from "react";
import { useCreateVehicle } from "../hooks/useCreateVehicle";
import { useVehicles } from "../hooks/useVehicles";
import type { Cambio, Combustivel, VehiclePayload } from "../types";

// Deliberately unstyled — this page exists to prove the login → list →
// create loop works end to end against the real API before #13/#17 build
// the real listing and form screens on top of the same hooks.
const emptyForm: VehiclePayload = {
  placa: "",
  chassi: "",
  marca: "",
  modelo: "",
  versao: "",
  valor_venda: "",
  cor: "",
  km: 0,
  cambio: "manual",
  combustivel: "flex",
};

export function VehicleListPage() {
  const { data, isLoading, isError, error } = useVehicles({ per_page: 50 });
  const createVehicle = useCreateVehicle();
  const [form, setForm] = useState<VehiclePayload>(emptyForm);

  function handleChange<K extends keyof VehiclePayload>(
    key: K,
    value: VehiclePayload[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await createVehicle.mutateAsync(form);
    setForm(emptyForm);
  }

  return (
    <div>
      <h2>Veículos (spike — sem estilo)</h2>

      {isLoading && <p>Carregando...</p>}
      {isError && <p>Erro: {(error as Error).message}</p>}

      <ul>
        {data?.data.map((vehicle) => (
          <li key={vehicle.id}>
            {vehicle.placa} — {vehicle.marca} {vehicle.modelo} —{" "}
            {vehicle.valor_venda}
          </li>
        ))}
      </ul>

      <h3>Novo veículo</h3>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="placa"
          value={form.placa}
          onChange={(e) => handleChange("placa", e.target.value)}
        />
        <input
          placeholder="chassi"
          value={form.chassi}
          onChange={(e) => handleChange("chassi", e.target.value)}
        />
        <input
          placeholder="marca"
          value={form.marca}
          onChange={(e) => handleChange("marca", e.target.value)}
        />
        <input
          placeholder="modelo"
          value={form.modelo}
          onChange={(e) => handleChange("modelo", e.target.value)}
        />
        <input
          placeholder="versao"
          value={form.versao}
          onChange={(e) => handleChange("versao", e.target.value)}
        />
        <input
          placeholder="valor_venda"
          value={form.valor_venda}
          onChange={(e) => handleChange("valor_venda", e.target.value)}
        />
        <input
          placeholder="cor"
          value={form.cor}
          onChange={(e) => handleChange("cor", e.target.value)}
        />
        <input
          placeholder="km"
          type="number"
          value={form.km}
          onChange={(e) => handleChange("km", Number(e.target.value))}
        />
        <select
          value={form.cambio}
          onChange={(e) => handleChange("cambio", e.target.value as Cambio)}
        >
          <option value="manual">manual</option>
          <option value="automatico">automatico</option>
        </select>
        <select
          value={form.combustivel}
          onChange={(e) =>
            handleChange("combustivel", e.target.value as Combustivel)
          }
        >
          <option value="gasolina">gasolina</option>
          <option value="alcool">alcool</option>
          <option value="flex">flex</option>
          <option value="diesel">diesel</option>
          <option value="hibrido">hibrido</option>
          <option value="eletrico">eletrico</option>
        </select>
        <button type="submit" disabled={createVehicle.isPending}>
          Criar
        </button>
      </form>
      {createVehicle.isError && (
        <p>Erro ao criar: {(createVehicle.error as Error).message}</p>
      )}
    </div>
  );
}
